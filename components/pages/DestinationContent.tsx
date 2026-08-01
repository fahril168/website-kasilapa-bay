"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

const destinationImages = [
  "/img/destinations/hondue.webp", // Pantai Hondue
  "/img/destinations/kahianga.webp", // Puncak Kahianga
  "/img/destinations/roma.webp", // Roma
  "/img/destinations/nata.webp", // Benteng Nata
  "/img/destinations/huntete.webp", // Pantai huntete
  "/img/destinations/patua.webp" // Benteng Patua
];

export default function DestinationContent({ dict }: Props) {
  const places = dict.destination.places;

  return (
    <section className="pt-16 section-padding bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          title={dict.destination.title}
          subtitle={dict.destination.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {places.map((place, i) => (
            <motion.article
              key={place.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.1 }}
              className="group bg-slate-50 border border-slate-200 hover:border-ocean-deep/40 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl transition-colors transition-shadow duration-300"
            >
              <div>
                {/* Destination Image */}
                <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                  <div
                    className="w-full h-full group-hover:scale-108 transition-transform duration-700 ease-out"
                    style={{
                      backgroundImage: `url('${destinationImages[i] || destinationImages[0]}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <span className="text-[11px] font-bold tracking-wider uppercase text-ocean-deep bg-white/95 backdrop-blur-xs px-2.5 py-1 border border-slate-200 shadow-2xs">
                      {place.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3
                    className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-ocean-deep transition-colors duration-200 mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {place.name}
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed font-normal">
                    {place.description}
                  </p>
                </div>
              </div>

              {/* Distance badge */}
              <div className="px-6 pb-5 pt-2 border-t border-slate-200/60 flex items-center justify-between bg-white">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <MapPin size={13} className="text-ocean-deep" />
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
