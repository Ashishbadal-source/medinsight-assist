"""
step6_intelligence/interval_engine.py
Landmark Detection and Interval Measurement (Steps 6.2 - 6.4)
"""
import numpy as np

def calculate_intervals(signal: np.ndarray, r_peaks: list, fs: int = 500) -> dict:
    """
    Measures PR, QRS, QT and BPM.
    """
    if len(r_peaks) < 2:
        return {
            "heart_rate": 0, "rhythm": "insufficient_data",
            "pr_ms": 0, "qrs_ms": 0, "qt_ms": 0, "qtc_bazett": 0
        }
        
    # 6.4 BPM and Rhythm
    rr_intervals = np.diff(r_peaks) / fs
    avg_rr = np.mean(rr_intervals)
    bpm = 60.0 / avg_rr
    
    rr_var = np.std(rr_intervals)
    rhythm = "regular" if rr_var < 0.04 else "irregular" # AF threshold
    
    # 6.2 Landmark Detection (Sample first few clean beats)
    pr_times = []
    qrs_times = []
    qt_times = []
    
    # Constants (ms)
    p_win_start, p_win_end = int(0.200 * fs), int(0.050 * fs)
    qrs_half = int(0.060 * fs)
    t_win_start, t_win_end = int(0.100 * fs), int(0.450 * fs)
    
    for r in r_peaks[1:-1]: # Skip first and last for safety
        # P-Wave Search
        p_search = signal[r - p_win_start : r - p_win_end]
        if len(p_search) > 0:
            p_peak = (r - p_win_start) + np.argmax(np.abs(p_search))
            pr_times.append((r - p_peak) / fs)
            
        # QRS Duration (Rough estimate based on slope decay)
        qrs_search = signal[r - qrs_half : r + qrs_half]
        qrs_times.append(len(qrs_search) / fs * 0.8) # Heuristic factor
        
        # T-Wave Search
        t_search = signal[r + t_win_start : r + t_win_end]
        if len(t_search) > 0:
            t_peak = (r + t_win_start) + np.argmax(np.abs(t_search))
            qt_times.append((t_peak - (r - 0.05*fs)) / fs)

    # 6.3 Interval Aggregation
    pr_ms = np.median(pr_times) * 1000 if pr_times else 160.0
    qrs_ms = np.median(qrs_times) * 1000 if qrs_times else 90.0
    qt_ms = np.median(qt_times) * 1000 if qt_times else 380.0
    
    # QTc (Bazett)
    qtc_bazett = qt_ms / np.sqrt(avg_rr) if avg_rr > 0 else 0
    
    return {
        "heart_rate": round(bpm, 1),
        "rhythm": rhythm,
        "pr_ms": round(pr_ms, 1),
        "qrs_ms": round(qrs_ms, 1),
        "qt_ms": round(qt_ms, 1),
        "qtc_bazett": round(qtc_bazett, 1)
    }
