"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Music, AlertCircle } from "lucide-react";

export default function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [error, setError] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const playlist = [
        {
            src: "/stranger-things-theme.mp3",
            title: "Stranger Things Theme",
        },
        {
            src: "/running_up_that_hill.mp3",
            title: "Running Up That Hill",
        }
    ];

    const currentTrack = playlist[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    // Handle track ending - Loop between songs
    const handleEnded = () => {
        const nextIndex = (currentTrackIndex + 1) % playlist.length;
        setCurrentTrackIndex(nextIndex);
    };

    // Auto-play when track changes
    useEffect(() => {
        if (audioRef.current && isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch((e) => {
                    console.log("Playback failed:", e);
                });
            }
        }
    }, [currentTrackIndex]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch((e) => {
                        console.log("Audio playback failed:", e);
                        setError(true);
                    });
                }
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    // Auto-play attempt on mount and fallback to first interaction
    useEffect(() => {
        const playAudio = async () => {
            if (audioRef.current) {
                try {
                    await audioRef.current.play();
                    setIsPlaying(true);
                    setError(false);
                } catch (error) {
                    console.log("Auto-play blocked. Waiting for user interaction.");
                }
            }
        };

        // Try immediately
        playAudio();

        // Also add a one-time click listener to the document to ensure it starts
        const handleFirstClick = () => {
            if (audioRef.current && audioRef.current.paused) {
                playAudio();
            }
            // Remove listener after first interaction
            document.removeEventListener('click', handleFirstClick);
            document.removeEventListener('keydown', handleFirstClick);
        };

        document.addEventListener('click', handleFirstClick);
        document.addEventListener('keydown', handleFirstClick);

        return () => {
            document.removeEventListener('click', handleFirstClick);
            document.removeEventListener('keydown', handleFirstClick);
        };
    }, []);

    // Check if file exists on load
    const handleAudioError = () => {
        // Only show error if it's the first track failing, or handle gracefully
        console.log(`Error loading track: ${currentTrack.src}`);
        if (currentTrackIndex === 0) {
            setError(true);
            setIsPlaying(false);
        }
    };

    return (
        <>
            <audio
                ref={audioRef}
                src={currentTrack.src}
                preload="auto"
                onError={handleAudioError}
                onEnded={handleEnded}
            />

            <div className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-50 flex flex-col items-start gap-1 sm:gap-2 transition-all duration-500">
                {/* Label / Error Message */}
                {error ? (
                    <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-mono text-neon-red tracking-widest uppercase bg-black/90 px-2 py-0.5 sm:py-1 rounded border border-neon-red mb-0.5 sm:mb-1 animate-pulse">
                        <AlertCircle size={10} className="sm:w-[12px] sm:h-[12px]" />
                        AUDIO MISSING
                    </div>
                ) : (
                    <div className="text-[8px] sm:text-[10px] font-mono text-neon-red tracking-widest uppercase bg-black/80 px-2 py-0.5 sm:py-1 rounded border border-neon-red/30 mb-0.5 sm:mb-1 max-w-[150px] sm:max-w-[200px] truncate">
                        {isPlaying ? "NOW_PLAYING:" : "PAUSED:"} {currentTrack.title}
                    </div>
                )}

                <div className="flex items-center gap-2 sm:gap-3 bg-black/90 border-2 border-neon-red/50 p-2 sm:p-3 rounded-lg backdrop-blur-md shadow-[0_0_20px_rgba(229,9,20,0.3)] group scale-90 sm:scale-100 origin-left">

                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${error ? 'border-gray-500 text-gray-500 cursor-not-allowed' : 'bg-neon-red/10 border-neon-red/50 text-neon-red hover:bg-neon-red hover:text-black'}`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                        disabled={error}
                    >
                        {isPlaying ? <Pause size={14} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" /> : <Play size={14} className="sm:w-[18px] sm:h-[18px] ml-1" fill="currentColor" />}
                    </button>

                    {/* Volume Controls */}
                    <div className={`flex items-center gap-2 ${error ? 'opacity-50 pointer-events-none' : ''}`}>
                        <button
                            onClick={toggleMute}
                            className="text-off-white/70 hover:text-neon-red transition-colors"
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-off-white/20 rounded-lg appearance-none cursor-pointer accent-neon-red hover:accent-red-500"
                        />
                    </div>

                    {/* Visualizer Animation (Fake) */}
                    {isPlaying && !error && (
                        <div className="flex gap-[2px] h-4 items-end ml-2">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[3px] bg-neon-red animate-pulse"
                                    style={{
                                        height: `${Math.random() * 100}%`,
                                        animationDuration: `${0.5 + Math.random() * 0.5}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
