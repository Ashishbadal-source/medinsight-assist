import os, cv2, numpy as np, pandas as pd, tensorflow as tf
from tensorflow.keras import layers, models, optimizers
import threading, gc, requests
from scipy.signal import resample as scipy_resample
from huggingface_hub import HfApi
from tqdm import tqdm
import warnings; warnings.filterwarnings('ignore')

# ── TENSORFLOW SURVIVAL MODE (KAGGLE NATIVE) ──────────────────────────────────
HF_TOKEN = os.getenv("HF_TOKEN", "")
REPO_ID  = "Ashish4816/ecg-model"
IMG_DIR  = '/kaggle/working/data/images'
MSK_DIR  = '/kaggle/working/data/masks'
os.makedirs(IMG_DIR, exist_ok=True); os.makedirs(MSK_DIR, exist_ok=True)

H, W = 160, 320 

# ── DATA PREP (Same Logic) ──
ptbxl = '/kaggle/input/datasets/khyeh0719/ptb-xl-dataset/ptb-xl-a-large-publicly-available-electrocardiography-dataset-1.0.1/'
df = pd.read_csv(ptbxl+'ptbxl_database.csv', index_col='ecg_id')
import wfdb

def s2h(s1d):
    s = scipy_resample(s1d, W).astype(np.float32)
    mi, ma = s.min(), s.max(); yf = (1.0-(s-mi)/(ma-mi+1e-8))*(H*0.8)+H*0.1
    yi = np.arange(H,dtype=np.float32)[:,None]; hm = np.exp(-0.5*((yi-yf[None,:])/2.0)**2)
    return (hm/(hm.sum(0,keepdims=True)+1e-8)).astype(np.float32)

def gen_files(eid):
    i_o, m_o = os.path.join(IMG_DIR, f"{eid}.jpg"), os.path.join(MSK_DIR, f"{eid}.npz")
    if os.path.exists(i_o): return
    try:
        sig_r,_ = wfdb.rdsamp(ptbxl + df.loc[eid,'filename_hr'])
        sig = sig_r.T.astype(np.float32); h,w = 400, 800; img = np.ones((h,w,3),dtype=np.uint8)*255
        cw, rh = w//4, h//4
        for i in range(12):
            c,r = i%4,i//4; s = scipy_resample(sig[i], cw).astype(np.float32)
            y_c = r*rh+rh//2; sn = (s-s.mean())/s.std()*(rh*0.35) if s.std()>1e-6 else 0
            pts = np.stack([np.arange(cw)+c*cw, (y_c-sn).clip(0,h-1)],axis=1).reshape(-1,1,2).astype(np.int32)
            cv2.polylines(img,[pts],False,(0,0,0),1)
        cv2.imwrite(i_o, img)
        masks = [s2h(sig[1]) if r==3 else s2h(sig[[[0,3,6,9],[1,4,7,10],[2,5,8,11]][r][0]]) for r in range(4)]
        np.savez_compressed(m_o, m=np.stack(masks))
    except: pass

def run_prep():
    print("🚀 PHASE 1: Caching (TensorFlow Mode)...")
    ids = df.index.tolist()[:8000]
    for i in tqdm(range(0, len(ids), 32)):
        ts = [threading.Thread(target=gen_files, args=(eid,)) for eid in ids[i:i+32]]
        [t.start() for t in ts]; [t.join() for t in ts]

# ── TF LOADER ──
def tf_generator(ids):
    for eid in ids:
        img = cv2.imread(os.path.join(IMG_DIR, f"{eid}.jpg"))
        msk = np.load(os.path.join(MSK_DIR, f"{eid}.npz"))['m']
        ih,iw = img.shape[:2]; hh,rh = int(ih*0.1), (ih-int(ih*0.1))//4
        for r in range(4):
            crop = cv2.resize(img[hh+r*rh:hh+(r+1)*rh,:], (W, H))
            # Blend to 3-ch for MobileNet
            final = (crop.astype(np.float32)*0.9 + 25.5).astype(np.uint8)
            yield final/255.0, msk[r].reshape(H, W, 1)

# ── MODEL (Keras MobileNetV2 UNet) ──
def build_unet():
    base = tf.keras.applications.MobileNetV2(input_shape=(H, W, 3), include_top=False, weights='imagenet')
    # Use standard Keras layers (100% stable on Kaggle)
    l1 = base.get_layer('block_1_expand_relu').output # 80x160
    l2 = base.get_layer('block_3_expand_relu').output # 40x80
    l3 = base.get_layer('block_6_expand_relu').output # 20x40
    l4 = base.output # 5x10
    
    x = layers.UpSampling2D(2)(l4)
    x = layers.Concatenate()([x, layers.Resizing(10, 20)(l3)])
    x = layers.Conv2D(128, 3, padding='same', activation='relu')(x)
    
    x = layers.UpSampling2D(2)(x)
    x = layers.Concatenate()([x, layers.Resizing(20, 40)(l2)])
    x = layers.Conv2D(64, 3, padding='same', activation='relu')(x)
    
    x = layers.UpSampling2D(4)(x) # Back to 80x160
    x = layers.Concatenate()([x, l1])
    x = layers.Conv2D(32, 3, padding='same', activation='relu')(x)
    
    x = layers.UpSampling2D(2)(x) # 160x320
    out = layers.Conv2D(1, 1, activation='sigmoid')(x)
    return models.Model(inputs=base.input, outputs=out)

def main():
    run_prep()
    ids = [e for e in df.index.tolist()[:8000] if os.path.exists(os.path.join(IMG_DIR, f"{e}.jpg"))]
    
    ds = tf.data.Dataset.from_generator(lambda: tf_generator(ids), 
                                        output_signature=(tf.TensorSpec(shape=(H,W,3), dtype=tf.float32), 
                                                         tf.TensorSpec(shape=(H,W,1), dtype=tf.float32)))
    ds = ds.shuffle(100).batch(16).prefetch(tf.data.AUTOTUNE)
    
    model = build_unet()
    model.compile(optimizer=optimizers.Adam(1e-4), loss='binary_crossentropy')
    
    print("🚀 PHASE 2: Starting TensorFlow Stable Training...")
    for e in range(30):
        print(f"Epoch {e+1}/30")
        model.fit(ds, steps_per_epoch=len(ids)//16, epochs=1)
        model.save_weights('ecg_weights.weights.h5')
        # Simple Sync
        try:
            api = HfApi()
            api.upload_file(path_or_fileobj='ecg_weights.weights.h5', path_in_repo='ecg_best.weights.h5',
                            repo_id=REPO_ID, token=HF_TOKEN)
        except: pass

if __name__ == "__main__": main()
