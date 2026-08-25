"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const roomImages = ["/img/rooms/15.webp", "/img/rooms/2.webp"];

export default function FeaturedRooms({ dict, lang }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const rooms = dict.accommodation.rooms.slice(0, 2);

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
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1.5 transition-transform duration-200"
            />
          </Link>
        </motion.div>

        {/* Two rooms side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {rooms.map((room, i) => (
            <motion.div
              key={room.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              style={{ minHeight: "480px" }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Background image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${roomImages[i]}')` }}
              />

              {/* Gradient overlay — darker on hover */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background:
                    hoveredIndex === i
                      ? "linear-gradient(to top, rgba(26,23,20,0.92) 0%, rgba(26,23,20,0.55) 50%, rgba(26,23,20,0.15) 100%)"
                      : "linear-gradient(to top, rgba(26,23,20,0.85) 0%, rgba(26,23,20,0.25) 45%, rgba(26,23,20,0.05) 100%)",
                }}
              />

              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 z-10">
                {/* Room name */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-2 drop-shadow-lg">
                  {room.name}
                </h3>

                {/* Description — reveal on hover */}
                <motion.p
                  initial={false}
                  animate={{
                    opacity: hoveredIndex === i ? 1 : 0,
                    y: hoveredIndex === i ? 0 : 10,
                    height: hoveredIndex === i ? "auto" : 0,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-white/75 text-sm leading-relaxed max-w-md mb-0 overflow-hidden"
                >
                  {room.description}
                </motion.p>

                {/* Specs row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 mb-4">
                  <span className="flex items-center gap-1.5 text-white/60 text-xs font-medium">
                    <Users size={14} className="text-gold/80" />
                    {room.capacity} {dict.accommodation.guests}
                  </span>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-4" />

                {/* Price & CTA */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gold font-sans leading-none">
                      {formatPrice(room.price)}
                    </p>
                    <p className="text-white/45 text-xs mt-1 font-medium">
                      {dict.accommodation.perNight}
                    </p>
                  </div>
                  <Link
                    href={`/${lang}/akomodasi`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-gold border border-gold/30 hover:border-gold hover:bg-gold/10 rounded-full px-4 py-2 transition-all duration-300 uppercase tracking-wider"
                  >
                    <span>{dict.common.learnMore}</span>
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
