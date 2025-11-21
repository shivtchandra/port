import wave
import math
import random
import struct

def generate_drone(filename, duration=30, sample_rate=44100):
    num_samples = duration * sample_rate
    
    # Parameters for the "dark synth" sound
    # We'll combine a few low frequencies
    freq1 = 55.0  # A1
    freq2 = 110.0 # A2
    freq3 = 58.27 # A#1 (dissonance)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 2 bytes per sample (16-bit)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            t = i / sample_rate
            
            # Oscillators
            val1 = math.sin(2 * math.pi * freq1 * t)
            val2 = math.sin(2 * math.pi * freq2 * t) * 0.5
            val3 = math.sin(2 * math.pi * freq3 * t) * 0.3
            
            # LFO for amplitude modulation (pulsing effect)
            lfo = (math.sin(2 * math.pi * 0.5 * t) + 1) / 2
            
            # Add some noise/static
            noise = random.uniform(-0.05, 0.05)
            
            # Combine
            sample = (val1 + val2 + val3) * 0.4 * lfo + noise
            
            # Clip
            sample = max(min(sample, 1.0), -1.0)
            
            # Convert to 16-bit integer
            sample_int = int(sample * 32767.0)
            wav_file.writeframes(struct.pack('<h', sample_int))

if __name__ == "__main__":
    output_path = "/Users/shivat/Documents/portfolio 2/public/stranger-things-theme.wav"
    print(f"Generating audio to {output_path}...")
    generate_drone(output_path)
    print("Done.")
