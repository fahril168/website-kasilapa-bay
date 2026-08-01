"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const roomImages = [
  "/img/rooms/6.webp", // Deluxe Junior Suite
  "/img/rooms/12.webp", // Deluxe Room
  "/img/rooms/3.webp", // Deluxe Double
];

export default function FeaturedRooms({ dict, lang }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rooms = dict.accommodation.rooms;
  const activeRoom = rooms[activeIndex] || rooms[0];

  return (
    <section className="relative h-[100vh] min-h-[500px] max-h-[750px] w-full overflow-hidden flex flex-col justify-between bg-slate-900 text-white select-none">
      {/* Background Image Carousel with Overlay */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${roomImages[activeIndex] || roomImages[0]}')`,
            }}
          />
        </AnimatePresence>
        {/* Subtle dark gradient overlay so photos stay bright and vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent z-10" />
      </div>

      {/* Spacer Top */}
      <div className="relative z-20 pt-8" />

      {/* Center Content: Active Room Details */}
      <div className="relative z-20 mx-auto max-w-4xl px-6 text-center flex flex-col items-center py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h3
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 tracking-tight drop-shadow-md"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {activeRoom.name}
            </h3>

            <p className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl mb-8 font-normal">
              {activeRoom.description}
            </p>

            {/* View All / Explore Link */}
            <Link
              href={`/${lang}/akomodasi`}
              className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white transition-colors duration-200 uppercase tracking-wider group"
            >
              <span>{dict.common.viewAll}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200 text-sky-400" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Room Selector Tabs (Clean Transparent Overlay) */}
      <div className="relative z-20 pb-10 px-6">
        <div className="mx-auto max-w-5xl flex items-center justify-center flex-wrap gap-6 sm:gap-12">
          {rooms.map((room, i) => (
            <button
              key={room.name}
              onClick={() => setActiveIndex(i)}
              className={`text-sm sm:text-base font-semibold tracking-wide transition-all duration-300 relative py-1 ${
                activeIndex === i
                  ? "text-sky-400 font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {room.name}
              {activeIndex === i && (
                <motion.div
                  layoutId="activeRoomTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
