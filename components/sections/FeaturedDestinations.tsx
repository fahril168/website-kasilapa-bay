"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Locale, Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const destinationImages = [
  "/img/destinations/kahianga.webp", // Kahianga
  "/img/destinations/huntete.webp", // Huntete
  "/img/destinations/roma.webp" // Roma
];

export default function FeaturedDestinations({ dict, lang }: Props) {
  const places = dict.destination.places.slice(0, 3);

  return (
    <section className="section-padding bg-slate-50 border-t border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          title={dict.destination.title}
          subtitle={dict.destination.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {places.map((place, i) => (
            <motion.div
              key={place.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-white border border-slate-200 hover:border-ocean-deep/40 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <div>
                {/* Destination Image with Zoom on Hover */}
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
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <h3
                      className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-ocean-deep transition-colors duration-200"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {place.name}
                    </h3>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed font-normal mb-4">
                    {place.description}
                  </p>
                </div>
              </div>

              {/* Footer Distance Badge */}
              <div className="px-6 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <MapPin size={13} className="text-ocean-deep" />
                  {place.distance}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${lang}/destinasi`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-ocean-deep transition-colors duration-200 tracking-wide uppercase group"
          >
            <span>{dict.common.viewAll}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
