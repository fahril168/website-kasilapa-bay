"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

const galleryImages = [
  { src: "/img/rooms/24.webp", category: "property", alt: "Kasilapa Bay Property" },
  { src: "/img/rooms/2.webp", category: "property", alt: "Room Interior" },
  { src: "/img/rooms/3.webp", category: "property", alt: "Deluxe Double" },
  { src: "/img/rooms/18.webp", category: "property", alt: "Room View" },
  { src: "/img/rooms/7.webp", category: "property", alt: "Cozy Room" },
  { src: "/img/rooms/6.webp", category: "property", alt: "Junior Suite" },
  { src: "/img/rooms/13.webp", category: "property", alt: "Room Detail" },
  { src: "/img/rooms/22.webp", category: "property", alt: "Deluxe Room" },
  { src: "/img/rooms/10.webp", category: "property", alt: "Room Amenity" },
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

  const handleLightboxNav = (direction: "prev" | "next") => {
    if (lightbox === null) return;
    if (direction === "prev") {
      setLightbox(lightbox === 0 ? filtered.length - 1 : lightbox - 1);
    } else {
      setLightbox(lightbox === filtered.length - 1 ? 0 : lightbox + 1);
    }
  };

  return (
    <>
      <section className="pt-16 section-padding bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kasilapa Bay"
            title={dict.gallery.title}
            subtitle={dict.gallery.subtitle}
          />

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`text-xs font-semibold tracking-wider uppercase px-5 py-2.5 border transition-all duration-200 rounded-full ${
                  activeFilter === key
                    ? "border-foreground text-white bg-foreground"
                    : "border-border text-muted bg-transparent hover:border-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Masonry columns layout — 4 columns, filled space with varied vertical sizes */}
          <motion.div
            layout
            className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => {
                // Apply different aspect ratios to create varied vertical sizes
                let aspectClass = "aspect-auto";
                if (i % 3 === 0) {
                  aspectClass = "aspect-[3/4]"; // Portrait
                } else if (i % 3 === 1) {
                  aspectClass = "aspect-square"; // Square
                } else {
                  aspectClass = "aspect-[4/3]"; // Landscape
                }

                return (
                  <motion.button
                    key={img.src}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setLightbox(i)}
                    className={`img-zoom relative cursor-pointer block w-full rounded-lg overflow-hidden mb-3 sm:mb-4 break-inside-avoid ${aspectClass}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-foreground/0 hover:bg-foreground/20 transition-colors duration-300" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox with navigation */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/60 hover:text-white transition-colors z-10 p-2"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); handleLightboxNav("prev"); }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); handleLightboxNav("next"); }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>

            <motion.img
              key={filtered[lightbox]?.src}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={filtered[lightbox]?.src}
              alt={filtered[lightbox]?.alt || "Kasilapa Bay Gallery Image"}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Counter */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium">
              {lightbox + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
