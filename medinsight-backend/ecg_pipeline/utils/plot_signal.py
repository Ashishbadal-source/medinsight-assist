import matplotlib.pyplot as plt

def plot_signal(signal, title="ECG Signal"):
    plt.plot(signal)
    plt.title(title)
    plt.show()
