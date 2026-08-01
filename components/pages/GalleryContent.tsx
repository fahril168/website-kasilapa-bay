"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

const galleryImages = [
  { src: "/img/rooms/6.webp", category: "property", alt: "Deluxe Junior Suite" },
  { src: "/img/rooms/12.webp", category: "property", alt: "Deluxe Room" },
  { src: "/img/rooms/3.webp", category: "property", alt: "Deluxe Double" },
  { src: "/img/destinations/hondue.webp", category: "island", alt: "Pantai Hondue" },
  { src: "/img/destinations/kahianga.webp", category: "island", alt: "Puncak Kahianga" },
  { src: "/img/destinations/roma.webp", category: "underwater", alt: "Spot Diving Roma" },
  { src: "/img/destinations/nata.webp", category: "island", alt: "Benteng Nata" },
  { src: "/img/destinations/huntete.webp", category: "island", alt: "Pantai Huntete" },
  { src: "/img/destinations/patua.webp", category: "island", alt: "Benteng Patua" },
];

type FilterKey = "all" | "property" | "underwater" | "island" | "dining";

export default function GalleryContent({ dict }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filters = Object.entries(dict.gallery.filters) as [FilterKey, string][];

  const filtered =
    activeFilter === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);

  return (
    <>
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeader
            title={dict.gallery.title}
            subtitle={dict.gallery.subtitle}
          />

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`text-xs font-semibold tracking-wider uppercase px-4 py-2 border transition-colors duration-200 rounded-xs ${
                  activeFilter === key
                    ? "border-slate-900 text-white bg-slate-900"
                    : "border-slate-300 text-slate-700 bg-white hover:border-slate-900 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.button
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setLightbox(i)}
                  className="img-zoom aspect-square bg-slate-100 relative cursor-pointer block w-full border border-slate-200 rounded-xs"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 flex items-center justify-center p-3 sm:p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={filtered[lightbox]?.src}
              alt={filtered[lightbox]?.alt || "Kasilapa Bay Gallery Image"}
              className="max-w-full max-h-[85vh] object-contain rounded-xs"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
