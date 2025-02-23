"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BackgroundContextType {
  currentVideo: string;
  changeBackground: (video: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null); // Changed to null initial state
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isFirstRender = useRef(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isChangingVideo = useRef(false);

  useEffect(() => {
    // Load initial background video
    if (!currentVideo && !isChangingVideo.current) {
      const loadInitialVideo = () => {
        try {
          const timestamp = Date.now();
          const videoPath = `/videos/background.mp4?v=${timestamp}`;
          setCurrentVideo(videoPath);
        } catch (err) {
          console.error("Failed to load initial video:", err);
          setHasError(true);
        }
      };

      loadInitialVideo();
    }
  }, [currentVideo]);

  const changeBackground = useCallback((videoName: string) => {
    if (isChangingVideo.current) return;

    isChangingVideo.current = true;
    setIsVideoLoaded(false);

    try {
      // Wait for the current video to fade out
      setTimeout(() => {
        setCurrentVideo(videoName);
        isFirstRender.current = false;
        setHasError(false);
        isChangingVideo.current = false;
      }, 300); // Match this with your transition duration
    } catch (err) {
      console.error("Failed to change video:", err);
      setHasError(true);
      isChangingVideo.current = false;
    }
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !currentVideo) return;

    const handleCanPlay = () => {
      console.log("Video can play:", currentVideo); // Debug log
      setIsVideoLoaded(true);
      setHasError(false);
      videoElement.play().catch((err) => console.error("Play error:", err));
    };

    const handleError = (e: ErrorEvent) => {
      console.error("Video error:", e, "Current video:", currentVideo);
      setHasError(true);
      setIsVideoLoaded(false);
    };

    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("error", handleError);
    videoElement.load(); // Force reload

    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("error", handleError);
    };
  }, [currentVideo]);

  return (
    <BackgroundContext.Provider
      value={{ currentVideo: currentVideo || "", changeBackground }}
    >
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Fallback background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-midnight via-deep-navy to-midnight opacity-100 transition-opacity duration-1000"
          style={{ opacity: isVideoLoaded ? 0 : 1 }}
        />

        {currentVideo && !hasError && (
          <video
            ref={videoRef}
            preload="auto"
            autoPlay
            muted
            loop
            playsInline
            className="absolute w-full h-full object-cover transition-opacity duration-1000"
            style={{
              opacity: isVideoLoaded ? 0.5 : 0,
              pointerEvents: "none",
            }}
            onError={(e) => {
              console.error("Video loading error:", e);
              setHasError(true);
            }}
          >
            <source src={currentVideo} type="video/mp4" />
          </video>
        )}
      </div>
      {children}
    </BackgroundContext.Provider>
  );
}

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context)
    throw new Error("useBackground must be used within BackgroundProvider");
  return context;
};
