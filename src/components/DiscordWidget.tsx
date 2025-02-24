"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useBackground } from "@/contexts/BackgroundContext";
import { useInView } from "framer-motion";

const DISCORD_SERVER_ID = "1007520773096886323";
const DISCORD_INVITE_LINK = "https://discord.gg/TSdpyMMfrU";

export default function DiscordWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const { changeBackground } = useBackground();
  const lastActiveVideo = useRef<string>("/videos/background.mp4");
  const isActive = useRef(false);

  useEffect(() => {
    if (isInView && !isActive.current) {
      isActive.current = true;
      lastActiveVideo.current = "/videos/Background2.mp4"; // Store current video

      const timestamp = Date.now();
      changeBackground(`/videos/Background3.mp4?t=${timestamp}`);
    } else if (!isInView && isActive.current) {
      isActive.current = false;
      const timestamp = Date.now();
      changeBackground(lastActiveVideo.current + `?t=${timestamp}`);
    }

    return () => {
      if (isActive.current) {
        isActive.current = false;
        changeBackground(lastActiveVideo.current);
      }
    };
  }, [isInView, changeBackground]);

  useEffect(() => setIsMounted(true), []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[600px] mx-auto mt-12"
    >
      <motion.div
        className="glass-card overflow-hidden relative rounded-xl shadow-lg border border-sky-500/10
          hover:border-sky-500/20 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        animate={{ height: isExpanded ? "auto" : "120px" }}
      >
        {/* Update background pattern styling */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-[url('/discord-pattern.svg')] bg-repeat opacity-5"
            style={{ backgroundSize: "60px 60px" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-pink-500 mix-blend-overlay opacity-5" />
        </div>

        <div className="relative p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#5865F2] via-[#757DE8] to-[#5865F2]"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-[2px] rounded-full bg-midnight flex items-center justify-center">
                  <motion.svg
                    className="w-6 h-6 text-[#5865F2]"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    animate={{ rotate: isHovered ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z" />
                  </motion.svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-sky-300">
                  Discord Community
                </h3>
                <p className="text-xs text-ice-blue/50">
                  Join our growing community
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.a
                href={DISCORD_INVITE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-[#5865F2] text-white text-sm font-medium
                  hover:bg-[#4752C4] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                Join Server
              </motion.a>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-sky-500/10 rounded-lg transition-colors"
              >
                <motion.svg
                  className="w-6 h-6 text-sky-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isMounted && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <iframe
                  src={`https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark`}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                  className="rounded-lg w-full bg-midnight/50"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
