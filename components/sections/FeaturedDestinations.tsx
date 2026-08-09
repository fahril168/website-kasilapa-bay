"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const destinationImages = [
  "/img/destinations/kahianga.webp",
  "/img/destinations/huntete.webp",
  "/img/destinations/roma.webp",
];

export default function FeaturedDestinations({ dict, lang }: Props) {
  const places = dict.destination.places.slice(0, 5);

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/img/beach.webp')" }}
      />
      {/* Overlay to soften background image */}
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <span className="label-accent">{dict.destination.title}</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.15] mb-4 tracking-tight">
            {dict.destination.subtitle}
          </h2>
        </motion.div>

        {/* Grid Layout matching the Destination Page (2 rows: Puncak Kahianga is 2-col, others are 1-col) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense gap-4 sm:gap-5">
          {places.map((place: any, i) => (
            <motion.a
              key={place.name}
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.1 }}
              className={`group relative rounded-xl overflow-hidden cursor-pointer block ${i === 0
                  ? "sm:col-span-2 lg:col-span-2 aspect-[16/9]"
                  : i === 1
                    ? "aspect-[4/3] lg:aspect-[8/9]"
                    : "aspect-[4/3]"
                }`}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url('${place.image}')`,
                }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/80 via-[#1a1714]/20 to-transparent" />

              {/* Category badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white bg-gold/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {place.category}
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-serif mb-2 group-hover:text-gold transition-colors duration-300">
                  {place.name}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-3 max-w-md line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {place.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60">
                  <MapPin size={12} className="text-gold" />
                  {place.distance}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* View All link */}
        <div className="text-center mt-12">
          <Link
            href={`/${lang}/destinasi`}
            className="btn-outline group"
          >
            <span>{dict.common.viewAll}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
