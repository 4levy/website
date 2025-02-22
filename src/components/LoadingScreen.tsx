"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimeout: NodeJS.Timeout;
    const startTime = Date.now();

    const trackResourceLoading = () => {
      const resources = performance.getEntriesByType("resource");
      const totalResources = resources.length;
      const loadedResources = resources.filter((r) => r.duration > 0).length;
      const loadProgress = Math.min(
        (loadedResources / totalResources) * 100,
        100
      );

      const timeProgress = Math.min(
        ((Date.now() - startTime) / 2000) * 100,
        100
      );

      const currentProgress = Math.max(loadProgress, timeProgress);

      setProgress(Math.round(currentProgress));

      if (currentProgress < 100) {
        progressTimeout = setTimeout(trackResourceLoading, 100);
      } else {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    if (document.readyState === "complete") {
      trackResourceLoading();
    } else {
      window.addEventListener("load", trackResourceLoading);
    }

    return () => {
      clearTimeout(progressTimeout);
      window.removeEventListener("load", trackResourceLoading);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-midnight to-slate-900"
        >
          <div className="relative w-64 flex flex-col items-center">
            {/* Logo with progress-based scaling */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: 1 + progress / 200, // Subtle scale increase based on progress
                opacity: 1,
              }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <h1 className="text-5xl font-bold gradient-text">.xyz</h1>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="h-full bg-gradient-to-r from-sky-400 to-blue-600"
              />
            </div>

            {/* Resource loading status */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-ice-blue/70"
            >
              {progress < 100 ? (
                <>
                  Loading resources{" "}
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ...
                  </motion.span>
                </>
              ) : (
                "Finishing up..."
              )}
            </motion.p>

            {/* Percentage counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xl font-mono text-sky-400"
            >
              {progress}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
