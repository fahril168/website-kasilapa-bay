"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

const destinationImages = [
  "/img/destinations/hondue.webp",
  "/img/destinations/kahianga.webp",
  "/img/destinations/roma.webp",
  "/img/destinations/nata.webp",
  "/img/destinations/huntete.webp",
  "/img/destinations/patua.webp",
];

export default function DestinationContent({ dict }: Props) {
  const places = dict.destination.places;

  return (
    <section className="pt-16 section-padding bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          label="Wakatobi"
          title={dict.destination.title}
          subtitle={dict.destination.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {places.map((place, i) => (
            <motion.article
              key={place.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.1 }}
              className={`group relative rounded-xl overflow-hidden cursor-pointer ${
                i === 0 ? "sm:col-span-2 lg:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
              }`}
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url('${destinationImages[i] || destinationImages[0]}')`,
                }}
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/80 via-[#1a1714]/20 to-transparent" />

              {/* Category badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-white bg-gold/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {place.category}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif mb-2 group-hover:text-gold transition-colors duration-300">
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
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
