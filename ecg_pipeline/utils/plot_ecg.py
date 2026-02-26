import matplotlib.pyplot as plt

def plot_ecg(ecg, fs=500):
    t = [i / fs for i in range(ecg.shape[1])]

    plt.figure(figsize=(12, 8))
    for i in range(ecg.shape[0]):
        plt.plot(t, ecg[i] + i * 3)

    plt.xlabel("Time (s)")
    plt.ylabel("Leads")
    plt.title("Extracted ECG")
    plt.show()
