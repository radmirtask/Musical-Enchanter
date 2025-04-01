import sys
import json
import os
import librosa
import numpy as np
from scipy.signal import find_peaks

def analyze_track(file_path):
    """
    Comprehensive audio analysis for viral potential optimization
    """
    print(f"Analyzing file: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        print(f"Error: File not found - {file_path}")
        return json.dumps({
            "error": "File not found",
            "tempo": 120,
            "energy": 0.5,
            "segments": {
                "hooks": [[15, 25], [45, 55]],
                "drops": [[30, 35]],
                "transitions": [[25, 30], [55, 60]]
            }
        })
    
    try:
        # Load audio file
        y, sr = librosa.load(file_path, sr=None)
        
        # Calculate duration
        duration = librosa.get_duration(y=y, sr=sr)
        
        # Basic features
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        
        # Harmonic and percussive separation
        y_harmonic, y_percussive = librosa.effects.hpss(y)
        
        # STFT for spectral features
        stft = np.abs(librosa.stft(y))
        
        # Mel spectrogram
        mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr)
        
        # Chroma features for harmonic content analysis
        chroma = librosa.feature.chroma_stft(S=stft, sr=sr)
        
        # Onset detection for rhythm analysis
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, 
                                          pre_max=3, post_max=3, 
                                          pre_avg=3, post_avg=5, 
                                          delta=0.2, wait=10)
        onset_times = librosa.frames_to_time(onsets, sr=sr)
        
        # RMS energy
        rms = librosa.feature.rms(y=y)[0]
        energy = float(np.mean(rms))
        
        # Spectral contrast for timbral analysis
        contrast = librosa.feature.spectral_contrast(S=stft, sr=sr)
        mean_contrast = float(np.mean(contrast))
        
        # Hook detection (intervals with high novelty and energy)
        hooks = detect_hooks(y, sr, onset_env, rms)
        
        # Drop detection (energy peaks with preceding dips)
        drops = detect_drops(y, sr, rms)
        
        # Transition detection (harmonic changes)
        transitions = detect_transitions(chroma, sr)
        
        # Calculate beat positions to help identify structure
        _, beats = librosa.beat.beat_track(y=y, sr=sr, trim=False)
        beat_times = librosa.frames_to_time(beats, sr=sr)
        
        # Result format
        analysis_result = {
            "tempo": float(tempo),
            "energy": float(energy),
            "duration": float(duration),
            "contrast": float(mean_contrast),
            "segments": {
                "hooks": hooks,
                "drops": drops,
                "transitions": transitions
            },
            "beat_count": len(beats),
        }
        
        return json.dumps(analysis_result)
    
    except Exception as e:
        print(f"Error analyzing audio: {str(e)}")
        return json.dumps({
            "error": str(e),
            "tempo": 120,
            "energy": 0.5,
            "segments": {
                "hooks": [[15, 25], [45, 55]],
                "drops": [[30, 35]],
                "transitions": [[25, 30], [55, 60]]
            }
        })

def detect_hooks(y, sr, onset_env, rms, min_duration=3, max_duration=8):
    """
    Detect potential hooks - segments with high novelty and consistent energy
    that are likely to be catchy and memorable
    """
    # Spectral novelty for melodic/harmonic changes
    novelty = librosa.onset.onset_strength(y=y, sr=sr, 
                                         aggregate=np.median, 
                                         fmax=8000)
    
    # Detect peaks in novelty
    novelty_peaks, _ = find_peaks(novelty, height=np.mean(novelty)*1.5, 
                                distance=sr//2)  # Minimum distance of 0.5 sec
    
    # Convert to time
    peak_times = librosa.frames_to_time(novelty_peaks, sr=sr)
    
    # Filter based on RMS energy - hooks should have good energy
    hooks = []
    for peak_time in peak_times:
        # Find the corresponding frame index
        frame_idx = librosa.time_to_frames(peak_time, sr=sr)
        if frame_idx >= len(rms):
            continue
            
        # Check if energy is high enough
        if rms[frame_idx] > np.mean(rms) * 0.8:
            # Create hook segment with appropriate duration
            # Ensure it doesn't extend beyond audio length
            duration = min(max_duration, max(min_duration, 
                                         min(6, (len(y)/sr - peak_time))))
            
            hooks.append([float(peak_time), float(peak_time + duration)])
    
    # Cap to most prominent hooks (max 3)
    if len(hooks) > 3:
        hooks = hooks[:3]
    
    # If no hooks detected, provide a reasonable fallback
    if not hooks and len(y)/sr > 30:
        # Pick a point about 1/3 into the song
        start_time = (len(y)/sr) / 3
        hooks = [[float(start_time), float(start_time + 5)]]
    
    return hooks

def detect_drops(y, sr, rms, min_strength=0.6, min_duration=2, max_duration=6):
    """
    Detect potential drops - sudden increases in energy after quieter sections
    """
    # Normalize RMS
    norm_rms = (rms - np.min(rms)) / (np.max(rms) - np.min(rms) + 1e-10)
    
    # Calculate the derivative to find sharp increases
    rms_diff = np.diff(norm_rms)
    
    # Find peaks in the derivative (sharp increases in energy)
    drop_candidates, _ = find_peaks(rms_diff, height=min_strength, distance=sr)
    
    # Convert to time
    drop_times = librosa.frames_to_time(drop_candidates, sr=sr)
    
    # Validate drops - ensure they follow lower energy section
    drops = []
    for i, drop_time in enumerate(drop_times):
        frame_idx = librosa.time_to_frames(drop_time, sr=sr)
        
        # Check for sufficient frames before and after
        if frame_idx < 20 or frame_idx >= len(norm_rms) - 20:
            continue
        
        # Check for energy increase
        pre_energy = np.mean(norm_rms[frame_idx-20:frame_idx-5])
        post_energy = np.mean(norm_rms[frame_idx:frame_idx+20])
        
        if post_energy > pre_energy * 1.5:
            duration = min(max_duration, max(min_duration, 5))
            drops.append([float(drop_time), float(drop_time + duration)])
    
    # Limit to top 2 drops
    if len(drops) > 2:
        drops = drops[:2]
        
    return drops

def detect_transitions(chroma, sr, threshold=0.15, min_duration=1, max_duration=3):
    """
    Detect transitions between different harmonic sections
    """
    # Calculate average chroma vector for each frame
    avg_chroma = np.mean(chroma, axis=0)
    
    # Calculate the difference between consecutive frames
    chroma_diff = np.sum(np.abs(np.diff(chroma, axis=1)), axis=0)
    
    # Normalize
    if np.max(chroma_diff) > 0:
        chroma_diff = chroma_diff / np.max(chroma_diff)
    
    # Find peaks (harmonic changes)
    transition_frames, _ = find_peaks(chroma_diff, height=threshold, distance=20)
    
    # Convert to time
    transition_times = librosa.frames_to_time(transition_frames, sr=sr)
    
    # Create transition segments
    transitions = []
    for t_time in transition_times:
        duration = min(max_duration, max(min_duration, 2))
        transitions.append([float(t_time), float(t_time + duration)])
    
    # Limit to most significant transitions
    if len(transitions) > 5:
        transitions = transitions[:5]
    
    return transitions

if __name__ == "__main__":
    if len(sys.argv) > 1:
        result = analyze_track(sys.argv[1])
        print(result)
    else:
        print(json.dumps({"error": "No input file provided"}))
