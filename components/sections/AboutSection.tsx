"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

const roomImages = [
  {src: "/img/rooms/22.jpg",},
  {src: "/img/rooms/23.jpg",},
  {src: "/img/rooms/20.jpg",},
  {src: "/img/rooms/7.jpg",},
  {src: "/img/rooms/15.jpg",},
];

export default function AboutSection({ dict }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % roomImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding bg-slate-50 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Left-aligned Headline & Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left"
          >
            {/* Headline */}
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {dict.about.headline}
            </h2>

            {/* Accent divider line */}
            <div className="w-16 h-1 bg-ocean-deep mb-6 rounded-full" />

            {/* Description */}
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {dict.about.description}
            </p>
          </motion.div>

          {/* Right Column: Pure Horizontal Slide Room Photo Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-[4/3] sm:aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 shadow-lg bg-slate-900"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentIndex}
                src={roomImages[currentIndex].src}
                initial={{ x: "100%" }}
                animate={{ x: "0%" }}
                exit={{ x: "-100%" }}
                transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
                className="w-full h-full object-cover absolute inset-0"
              />
            </AnimatePresence>

            {/* Bottom Gradient overlay & Room name caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center text-white z-20">
              {/* Indicator dots */}
              <div className="flex items-center gap-1.5">
                {roomImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === i
                        ? "w-6 bg-white"
                        : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
