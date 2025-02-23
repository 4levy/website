"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react";
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
  const [currentVideo, setCurrentVideo] = useState("/_next/static/media/background.mp4");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const isFirstRender = useRef(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const changeBackground = (video: string) => {
    isFirstRender.current = false;
    // Add _next prefix in production for video paths
    const videoPath = process.env.NODE_ENV === 'production' 
      ? `/_next/static/media/${video.split('/').pop()}`
      : video;
    setCurrentVideo(videoPath);
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleCanPlay = () => {
      setIsVideoLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      console.error("Video failed to load:", currentVideo);
      setHasError(true);
      setIsVideoLoaded(false);
    };

    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("error", handleError);

    // Force reload the video
    videoElement.load();

    return () => {
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("error", handleError);
    };
  }, [currentVideo]);

  return (
    <BackgroundContext.Provider
      value={{ currentVideo, changeBackground }}
    >
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* Fallback background */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-midnight via-deep-navy to-midnight opacity-100 transition-opacity duration-1000"
          style={{ opacity: isVideoLoaded ? 0 : 1 }}
        />

        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute w-full h-full object-cover transition-opacity duration-1000"
          style={{
            opacity: isVideoLoaded ? 0.5 : 0,
            pointerEvents: "none",
          }}
        >
          <source src={currentVideo} type="video/mp4" />
        </video>
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
