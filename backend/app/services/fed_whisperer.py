import librosa
import numpy as np
import whisper
import os

class FedWhisperer:
    def __init__(self):
        # Load small model for local efficiency
        # In a real app, load this once at startup or lazily
        self.model = None 

    def _load_model(self):
        if not self.model:
            print("Loading Whisper Model...")
            self.model = whisper.load_model("base")

    def analyze_audio(self, file_path):
        self._load_model()
        
        # 1. Transcribe
        result = self.model.transcribe(file_path)
        transcript = result["text"]
        
        # 2. Extract Prosodic Features (Tone Analysis)
        y, sr = librosa.load(file_path)
        
        # Pitch (Fundamental Frequency - F0)
        f0, voiced_flag, voiced_probs = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
        f0_clean = f0[~np.isnan(f0)]
        pitch_variability = np.std(f0_clean) if len(f0_clean) > 0 else 0
        
        # Pause Duration (Silence detection)
        intervals = librosa.effects.split(y, top_db=20)
        silence_duration = (len(y) - sum([i[1] - i[0] for i in intervals])) / sr
        total_duration = len(y) / sr
        pause_ratio = silence_duration / total_duration if total_duration > 0 else 0
        
        # 3. Calculate Confidence Score
        # Heuristic: High pitch variability (expressive) + Low pause ratio (fluent) = High Confidence
        # This is a simplified "Fed Speak" decoder
        confidence_score = 0.5
        
        if pitch_variability > 20: confidence_score += 0.2
        if pause_ratio < 0.2: confidence_score += 0.2
        if "inflation" in transcript.lower() and "transitory" not in transcript.lower():
             confidence_score -= 0.1 # Hawkish uncertainty?
             
        return {
            "transcript": transcript,
            "features": {
                "pitch_variability": float(pitch_variability),
                "pause_ratio": float(pause_ratio),
                "duration": float(total_duration)
            },
            "confidence_score": min(max(confidence_score, 0.0), 1.0)
        }

fed_whisperer = FedWhisperer()
