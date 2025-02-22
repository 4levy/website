"use client";

import { useState, useEffect, useRef } from "react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    if (typeof window !== "undefined") {
      return parseFloat(localStorage.getItem("audioVolume") || "0.2");
    }
    return 0.3;
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const storedTime = localStorage.getItem("audioTime");
    const wasPreviouslyPlaying =
      localStorage.getItem("audioPlaying") === "true";

    if (audioRef.current) {
      audioRef.current.src = "/music/Background.mp3";
      audioRef.current.loop = true;
      audioRef.current.volume = volume;

      if (storedTime) {
        audioRef.current.currentTime = parseFloat(storedTime);
      }

      if (wasPreviouslyPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              console.log("Autoplay prevented");
            });
        }
      }
    }

    const saveInterval = setInterval(() => {
      if (audioRef.current) {
        localStorage.setItem(
          "audioTime",
          audioRef.current.currentTime.toString()
        );
        localStorage.setItem("audioPlaying", isPlaying.toString());
      }
    }, 1000);

    return () => clearInterval(saveInterval);
  }, []);

  useEffect(() => {
    localStorage.setItem("audioVolume", volume.toString());
  }, [volume]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.setItem(
          "audioTime",
          audioRef.current?.currentTime.toString() || "0"
        );
        localStorage.setItem("audioPlaying", isPlaying.toString());
      } else if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("loadedmetadata", handleLoadMetadata);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadMetadata
        );
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    localStorage.setItem("audioPlaying", newPlayingState.toString());
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div
        className="glass-card p-4 rounded-xl flex flex-col gap-3 min-w-[300px]
        shadow-lg shadow-sky-500/10 border border-sky-500/20"
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-sky-300 flex items-center gap-2">
            {isPlaying ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Now Playing
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Stopped
              </>
            )}
          </span>
          <span className="text-xs text-ice-blue/50">aishiterukarasa</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full 
              bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 transition-all
              hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-sky-500/20"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => {
                  const time = parseFloat(e.target.value);
                  if (audioRef.current) {
                    audioRef.current.currentTime = time;
                    setCurrentTime(time);
                  }
                }}
                className="w-full h-1 bg-sky-500/20 rounded-full appearance-none
                  cursor-pointer [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400
                  hover:[&::-webkit-slider-thumb]:bg-sky-300"
              />
            </div>
            <div className="flex justify-between text-xs text-ice-blue/50">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-ice-blue/50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              if (audioRef.current) {
                audioRef.current.volume = newVolume;
              }
            }}
            className="w-20 h-1 bg-sky-500/20 rounded-full appearance-none
              cursor-pointer [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400
              hover:[&::-webkit-slider-thumb]:bg-sky-300"
          />
        </div>

        <audio ref={audioRef} />
      </div>
    </div>
  );
}
