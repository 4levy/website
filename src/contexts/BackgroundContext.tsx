"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VIDEOS } from "@/constants/videos";

interface VideoSource {
  webm: string;
  mp4: string;
}

interface BackgroundContextType {
  currentVideo: VideoSource;
  changeBackground: (video: VideoSource) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

const VideoPreloader = memo(({ onLoad }: { onLoad: () => void }) => {
  useEffect(() => {
    const preloadVideo = async (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "auto";
        video.onloadeddata = () => resolve();
        video.onerror = reject;
        video.src = src;
      });
    };

    const loadVideos = async () => {
      try {
        await preloadVideo(VIDEOS.default.webm);
        onLoad();
      } catch (error) {
        console.warn("Falling back to MP4");
        try {
          await preloadVideo(VIDEOS.default.mp4);
          onLoad();
        } catch (err) {
          console.error("Failed to preload video:", err);
        }
      }
    };

    loadVideos();
  }, [onLoad]);

  return null;
});

const BackgroundVideo = memo(({ src }: { src: VideoSource }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = 0.75;
    video.style.transform = "translate3d(0, 0, 0)";

    const handleLoad = () => {
      requestAnimationFrame(() => {
        setIsLoaded(true);
      });
    };

    video.addEventListener("canplay", handleLoad);
    return () => video.removeEventListener("canplay", handleLoad);
  }, []);

  return (
    <video
      ref={videoRef}
      preload="auto"
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      style={{
        opacity: isLoaded ? 0.5 : 0,
        willChange: "transform, opacity",
        transform: "translate3d(0, 0, 0)",
      }}
    >
      <source src={src.webm} type="video/webm" />
      <source src={src.mp4} type="video/mp4" />
    </video>
  );
});

export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentVideo, setCurrentVideo] = useState<VideoSource>(VIDEOS.default);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isChangingVideo = useRef(false);

  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  const changeBackground = useCallback(
    (video: VideoSource) => {
      if (isChangingVideo.current || currentVideo === video) return;
      isChangingVideo.current = true;

      requestAnimationFrame(() => {
        setCurrentVideo(video);
        isChangingVideo.current = false;
      });
    },
    [currentVideo]
  );

  return (
    <BackgroundContext.Provider value={{ currentVideo, changeBackground }}>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-midnight">
        {!isVideoLoaded && <VideoPreloader onLoad={handleVideoLoaded} />}
        {isVideoLoaded && <BackgroundVideo src={currentVideo} />}
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
