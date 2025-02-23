"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PORTFOLIO_ITEMS } from "@/constants/config";

export default function Portfolio() {
  return (
    <motion.section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-12"
      >
        <h2 className="text-4xl font-bold text-white">Portfolio</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-sky-400/20 to-transparent" />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PORTFOLIO_ITEMS.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="group relative overflow-hidden rounded-xl">
              <div className="relative h-64 w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 
                    group-hover:scale-110 group-hover:rotate-1"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t 
                  from-midnight/90 via-midnight/50 to-transparent"
                />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div
                  className="transform translate-y-4 group-hover:translate-y-0 
                  transition-transform duration-300"
                >
                  <h3 className="text-2xl font-bold mb-2 text-sky-300">
                    {item.title}
                  </h3>
                  <p
                    className="text-ice-blue/70 mb-4 line-clamp-2 
                    group-hover:line-clamp-none"
                  >
                    {item.description}
                  </p>
                  <div
                    className="flex flex-wrap gap-2 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full 
                          bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
