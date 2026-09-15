"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { useDynamicSettings } from "@/lib/hooks/useDynamicSettings";

type Props = {
  dict: Dictionary;
  lang?: Locale;
};

const roomImages = [
  { src: "/img/rooms/1.webp", alt: "Kasilapa Bay Room 1" },
  { src: "/img/rooms/9.webp", alt: "Deluxe Room Interior" },
  { src: "/img/rooms/21.webp", alt: "Standart Room Interior" },
  { src: "/img/rooms/24.webp", alt: "Homestay View" },
  { src: "/img/rooms/34.webp", alt: "Relaxing Seating Area" },
];

const stats = [
  { value: "2", labelId: "Tipe Kamar", labelEn: "Room Types" },
  { value: "6", labelId: "Destinasi", labelEn: "Destinations" },
  { value: "4.9", labelId: "Rating Tamu", labelEn: "Guest Rating" },
];

export default function AboutSection({ dict, lang = "id" }: Props) {
  const { settings } = useDynamicSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stepWidth, setStepWidth] = useState(300);

  // Dynamic Headline and Description from Hostinger MySQL API
  const dynamicHeadline = lang === "en" 
    ? (settings?.about_headline_en || dict.about.headline)
    : (settings?.about_headline_id || dict.about.headline);

  const dynamicDescription = lang === "en"
    ? (settings?.about_description_en || dict.about.description)
    : (settings?.about_description_id || dict.about.description);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setStepWidth(containerWidth * 0.83 + 16);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % roomImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered]);

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
            <span className="label-accent">Kasilapa Bay</span>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.12] mb-6 tracking-tight font-serif">
              {dynamicHeadline}
            </h2>

            {/* Gold accent divider */}
            <div className="w-12 h-0.5 bg-gold mb-6" />

            <p className="text-muted text-base sm:text-lg leading-relaxed font-normal mb-10">
              {dynamicDescription}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground font-serif">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted font-medium tracking-wide mt-1">
                    {lang === "en" ? stat.labelEn : stat.labelId}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Image Track */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-7 relative w-full overflow-visible select-none group"
          >
            <div className="overflow-hidden w-full lg:w-[calc(100%+20vw)] lg:pr-[20vw]">
              <motion.div
                animate={{ x: -currentIndex * stepWidth }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="flex gap-4 sm:gap-5 w-full"
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

            {/* Navigation Controls */}
            <div className="absolute bottom-4 left-0 w-[83%] flex items-center justify-between px-4 z-30 pointer-events-auto">
              <button
                onClick={() =>
                  setCurrentIndex(
                    (prev) => (prev - 1 + roomImages.length) % roomImages.length
                  )
                }
                className="p-2 rounded-full bg-[#1a1714]/60 hover:bg-gold text-white backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1.5 bg-[#1a1714]/50 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                {roomImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i
                        ? "w-6 bg-gold"
                        : "w-2 bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev + 1) % roomImages.length)
                }
                className="p-2 rounded-full bg-[#1a1714]/60 hover:bg-gold text-white backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
