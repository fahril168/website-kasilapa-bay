"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const roomImages = [
  "/img/rooms/6.webp",
  "/img/rooms/12.webp",
  "/img/rooms/3.webp",
];

export default function FeaturedRooms({ dict, lang }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rooms = dict.accommodation.rooms;

  return (
    <section className="section-padding bg-dark-warm relative grain-overlay">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 lg:mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <div>
            <span className="label-accent">{dict.accommodation.title}</span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight">
              {dict.accommodation.subtitle}
            </h2>
          </div>
          <Link
            href={`/${lang}/akomodasi`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors duration-200 tracking-wide uppercase group shrink-0"
          >
            <span>{dict.common.viewAll}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Masonry-style grid: 1 large left, 2 stacked right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          {/* Large featured room */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] lg:aspect-auto lg:row-span-2 rounded-lg overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHoveredIndex(0)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${roomImages[0]}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/80 via-[#1a1714]/20 to-transparent" />

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-2">
                    {rooms[0]?.name}
                  </h3>
                  <motion.p
                    initial={false}
                    animate={{ opacity: hoveredIndex === 0 ? 1 : 0, y: hoveredIndex === 0 ? 0 : 8 }}
                    transition={{ duration: 0.3 }}
                    className="text-white/70 text-sm leading-relaxed max-w-md"
                  >
                    {rooms[0]?.description}
                  </motion.p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-gold font-sans">
                    {formatPrice(rooms[0]?.price)}
                  </p>
                  <p className="text-white/50 text-xs mt-0.5">
                    {dict.accommodation.perNight}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Two smaller rooms stacked */}
          {rooms.slice(1, 3).map((room, i) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i + 1) * 0.1 }}
              className="relative aspect-[16/9] rounded-lg overflow-hidden cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(i + 1)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${roomImages[i + 1] || roomImages[0]}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/80 via-[#1a1714]/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-1">
                      {room.name}
                    </h3>
                    <motion.p
                      initial={false}
                      animate={{ opacity: hoveredIndex === i + 1 ? 1 : 0, y: hoveredIndex === i + 1 ? 0 : 8 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/70 text-sm leading-relaxed max-w-sm"
                    >
                      {room.description}
                    </motion.p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-gold font-sans">
                      {formatPrice(room.price)}
                    </p>
                    <p className="text-white/50 text-xs mt-0.5">
                      {dict.accommodation.perNight}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
