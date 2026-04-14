import os, sys
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BACKEND_DIR = os.path.join(BASE_DIR, "medinsight-backend")
sys.path.insert(0, BASE_DIR)
sys.path.insert(0, BACKEND_DIR)

from new_pipeline.inference import ECGPipelineManager

manager = ECGPipelineManager.get_instance()
manager.load_models(None) # don't load segmentation weights, it's fine for testing the logic or it will fail?
# Wait, if we don't load weights, it will fail in TF.
