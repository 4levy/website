"use client";

import { createContext, useContext, useState, useRef } from "react";
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
  const [currentVideo, setCurrentVideo] = useState("/videos/background.mp4");
  const isFirstRender = useRef(true);

  const changeBackground = (video: string) => {
    isFirstRender.current = false;
    setCurrentVideo(video);
  };

  return (
    <BackgroundContext.Provider value={{ currentVideo, changeBackground }}>
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.video
            key={currentVideo}
            initial={isFirstRender.current ? { opacity: 0.5 } : { opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: isFirstRender.current ? 0 : 1 }}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate nopictureinpicture"
            className="absolute w-full h-full object-cover [&::-webkit-media-controls-panel]:hidden 
              [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-play-button]:hidden"
            style={{
              pointerEvents: "none",
              WebkitUserSelect: "none",
              msUserSelect: "none",
              userSelect: "none",
            }}
          >
            <source src={currentVideo} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
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
