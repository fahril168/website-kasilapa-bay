"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  // Calculate slide step width dynamically based on container size
  const getStepWidth = () => {
    if (!containerRef.current) return 300;
    const containerWidth = containerRef.current.offsetWidth;
    // Each item is 83% width + 16px gap
    return containerWidth * 0.83 + 16;
  };

  // Sync motion value when currentIndex changes (via auto-play, arrows, or dots)
  useEffect(() => {
    const step = getStepWidth();
    const targetX = -currentIndex * step;
    animate(x, targetX, { duration: 0.5, ease: [0.32, 0.72, 0, 1] });
  }, [currentIndex]);

  // Auto-play timer
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

  const handleDragEnd = (e: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const step = getStepWidth();
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -50 || velocity < -300) {
      if (currentIndex < roomImages.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Snap back if at end
        animate(x, -currentIndex * step, { duration: 0.4, ease: "easeOut" });
      }
    } else if (offset > 50 || velocity > 300) {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        // Snap back if at start
        animate(x, 0, { duration: 0.4, ease: "easeOut" });
      }
    } else {
      // Re-snap to current index if drag distance was small
      animate(x, -currentIndex * step, { duration: 0.4, ease: "easeOut" });
    }
  };

  return (
    <section className="section-padding bg-slate-50 border-b border-slate-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-5 text-left"
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

          {/* Right Column: 2-Image Peeking Carousel (Real-time Drag) */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-7 relative w-full overflow-hidden select-none group touch-pan-y"
          >
            {/* Real-time Drag Track */}
            <motion.div
              style={{ x }}
              drag="x"
              dragConstraints={{
                left: -((roomImages.length - 1) * 300),
                right: 0,
              }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              className="flex gap-4 sm:gap-5 w-full cursor-grab active:cursor-grabbing"
            >
              {roomImages.map((img, index) => (
                <div
                  key={index}
                  className="w-[83%] flex-shrink-0 relative aspect-[4/3] rounded-sm overflow-hidden border border-slate-200 shadow-md bg-slate-900"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                  {/* Subtle dark gradient overlay for bottom area */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none z-10" />
                </div>
              ))}
            </motion.div>

            {/* Continuously Visible Fixed Indicator Dots (Over Active Card Frame) */}
            <div className="absolute bottom-4 left-0 w-[83%] flex items-center justify-center text-white z-30 pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
                {roomImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
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

            {/* Left & Right Arrow Controls */}
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-slate-950/50 text-white/90 hover:text-white hover:bg-slate-950/80 transition-all duration-200 backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Previous Image"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-slate-950/50 text-white/90 hover:text-white hover:bg-slate-950/80 transition-all duration-200 backdrop-blur-xs opacity-80 sm:opacity-0 group-hover:opacity-100 shadow-md"
              aria-label="Next Image"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
