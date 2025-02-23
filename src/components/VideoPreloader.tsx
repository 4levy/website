"use client";

import { useEffect } from "react";

export default function VideoPreloader() {
  useEffect(() => {
    const preloadVideos = async () => {
      const videos = [
        { name: "background.mp4", path: "/videos/background.mp4" },
        { name: "Background2.mp4", path: "/videos/Background2.mp4" },
      ];

      videos.forEach(({ name, path }) => {
        const video = document.createElement("video");
        video.style.display = "none";
        video.preload = "auto";
        video.src = path;

        video.onloadeddata = () => {
          console.log(`Preloaded video: ${name}`);
          document.body.removeChild(video);
        };

        video.onerror = (e) => {
          console.error(`Error preloading video ${name}:`, e);
        };

        document.body.appendChild(video);
        video.load();
      });
    };

    preloadVideos();
  }, []);

  return null;
}
