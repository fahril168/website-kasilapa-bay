"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

const roomImages = [
  { src: "/img/rooms/22.webp", alt: "Deluxe Room Interior" },
  { src: "/img/rooms/23.webp", alt: "Ocean View Balcony" },
  { src: "/img/rooms/20.webp", alt: "Comfortable Double Bed" },
  { src: "/img/rooms/7.webp", alt: "Cozy Homestay Room" },
  { src: "/img/rooms/15.webp", alt: "Relaxing Seating Area" },
];

export default function AboutSection({ dict }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roomImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % roomImages.length);
  };

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

          {/* Right Column: Continuous Horizontal Track Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 shadow-lg bg-slate-900 select-none group touch-pan-y"
          >
            {/* Continuous Horizontal Track */}
            <motion.div
              className="flex w-full h-full cursor-grab active:cursor-grabbing"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x < -50 || velocity.x < -300) {
                  handleNext();
                } else if (offset.x > 50 || velocity.x > 300) {
                  handlePrev();
                }
              }}
            >
              {roomImages.map((img, index) => (
                <div key={index} className="w-full h-full flex-shrink-0 relative">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>
              ))}
            </motion.div>

            {/* Left & Right Arrow Controls */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-950/40 text-white/80 hover:text-white hover:bg-slate-950/70 transition-all duration-200 backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100"
              aria-label="Previous Image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-slate-950/40 text-white/80 hover:text-white hover:bg-slate-950/70 transition-all duration-200 backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100"
              aria-label="Next Image"
            >
              <ChevronRight size={20} />
            </button>

            {/* Bottom Gradient overlay & Indicator dots */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center text-white z-20">
              {/* Indicator dots */}
              <div className="flex items-center gap-1.5">
                {roomImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i
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
