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

const stats = [
  { value: "3", labelId: "Tipe Kamar", labelEn: "Room Types" },
  { value: "6", labelId: "Destinasi", labelEn: "Destinations" },
  { value: "4.9", labelId: "Rating Tamu", labelEn: "Guest Rating" },
];

export default function AboutSection({ dict }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const getStepWidth = () => {
    if (!containerRef.current) return 300;
    const containerWidth = containerRef.current.offsetWidth;
    return containerWidth * 0.83 + 16;
  };

  useEffect(() => {
    const step = getStepWidth();
    const targetX = -currentIndex * step;
    animate(x, targetX, { duration: 0.5, ease: [0.32, 0.72, 0, 1] });
  }, [currentIndex]);

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
        animate(x, -currentIndex * step, { duration: 0.4, ease: "easeOut" });
      }
    } else if (offset > 50 || velocity > 300) {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      } else {
        animate(x, 0, { duration: 0.4, ease: "easeOut" });
      }
    } else {
      animate(x, -currentIndex * step, { duration: 0.4, ease: "easeOut" });
    }
  };

  return (
    <section className="section-padding bg-surface relative overflow-hidden grain-overlay">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Headline & Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 text-left"
          >
            <span className="label-accent">
              {dict.about.headline ? "Kasilapa Bay" : "Kasilapa Bay"}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.12] mb-6 tracking-tight">
              {dict.about.headline}
            </h2>

            {/* Gold accent divider */}
            <div className="w-12 h-0.5 bg-gold mb-6" />

            <p className="text-muted text-base sm:text-lg leading-relaxed font-normal mb-10">
              {dict.about.description}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground font-serif">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted font-medium tracking-wide mt-1">
                    {stat.labelId}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Image Carousel with Full-Bleed to the right screen edge */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-7 relative w-full overflow-visible select-none group touch-pan-y"
          >
            {/* Overflow wrapper extends to the right edge of the viewport */}
            <div className="overflow-hidden w-full lg:w-[calc(100%+20vw)] lg:pr-[20vw]">
              {/* Drag Track */}
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
                    className="w-[83%] flex-shrink-0 relative aspect-[4/3] rounded-lg overflow-hidden bg-dark shadow-xl"
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/50 via-transparent to-transparent pointer-events-none z-10" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-0 w-[83%] flex items-center justify-center text-white z-30 pointer-events-auto">
              <div className="flex items-center gap-1.5 bg-[#1a1714]/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {roomImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(i);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i
                        ? "w-6 bg-gold"
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
