"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData, setStoredData } from "@/lib/storage";

type Props = {
  dict: Dictionary;
  lang?: Locale;
};

function getBentoSpan(index: number, total: number): string {
  if (total === 1) {
    return "col-span-2 lg:col-span-4 aspect-[16/9]";
  }
  if (total === 2) {
    return "col-span-1 lg:col-span-2 aspect-[4/3] lg:aspect-[16/10]";
  }
  if (total === 3) {
    return index === 0
      ? "col-span-2 lg:col-span-2 aspect-[16/10]"
      : "col-span-1 lg:col-span-1 aspect-square lg:aspect-[16/10]";
  }
  if (total === 6 && index === 5) {
    return "col-span-2 lg:col-span-4 aspect-[16/10] lg:aspect-[21/9]";
  }
  // If exactly 2 items remaining at the end that would leave half a row in a 4-col grid
  const remaining = total - index;
  if (remaining <= 2 && total % 4 === 2) {
    return "col-span-1 lg:col-span-2 aspect-[4/3] lg:aspect-[16/9]";
  }

  // Standard repeating Bento cycle (every 8 items)
  const cycle = index % 8;
  switch (cycle) {
    case 0:
      return "col-span-2 lg:col-span-2 lg:row-span-2 aspect-[16/10] lg:aspect-square";
    case 1:
    case 2:
    case 3:
    case 4:
      return "col-span-1 lg:col-span-1 aspect-square";
    case 5:
      return "col-span-2 lg:col-span-2 aspect-[16/10] lg:aspect-[16/9]";
    case 6:
    case 7:
    default:
      return "col-span-1 lg:col-span-1 aspect-square";
  }
}

const defaultRoomGalleryImages = [
  { src: "/img/room.webp", category: "property" as const, alt: "Standart Room" },
  { src: "/img/hero.webp", category: "property" as const, alt: "Deluxe Room" },
];

const defaultDestinationGalleryImages = [
  { src: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Puncak-Kahianga-by-Amal-Hermawan-428x242.jpg", category: "island" as const, alt: "Puncak Kahianga" },
  { src: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Huuntete-Beach-Kulati-by-Muis-Bhojest-min-428x242.jpg", category: "island" as const, alt: "Pantai Huntete" },
  { src: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Roma-by-Wakatobi-Regency-428x242.jpg", category: "underwater" as const, alt: "Spot Diving Roma" },
  { src: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Ndaa-Island-by-Guntur-2-428x242.jpg", category: "island" as const, alt: "Pulau Nda'a" },
  { src: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Patua-Fort-by-Amal-Hermawan-428x242.jpg", category: "island" as const, alt: "Benteng Patua" },
  { src: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Wreck-Kulati-by-Guntur-428x242.jpg", category: "underwater" as const, alt: "Wreck of Kulati" },
];

const defaultGalleryImages = [...defaultRoomGalleryImages, ...defaultDestinationGalleryImages];

type FilterKey = "all" | "property" | "underwater" | "island" | "dining";

export default function GalleryContent({ dict, lang = "id" }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [dynamicGallery, setDynamicGallery] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initial load from local persistent storage
    const stored = getStoredData<any[]>(STORAGE_KEYS.GALLERY, []);
    if (Array.isArray(stored) && stored.length > 0) {
      setDynamicGallery(stored);
    }

    // 2. Real-time sync listener
    const handleSync = () => {
      const updated = getStoredData<any[]>(STORAGE_KEYS.GALLERY, []);
      if (Array.isArray(updated) && updated.length > 0) {
        setDynamicGallery(updated);
      }
    };
    window.addEventListener(DATA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Background fetch from API
    fetch(getApiUrl("/api/galeri.php"))
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setDynamicGallery(json.data);
          setStoredData(STORAGE_KEYS.GALLERY, json.data);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener(DATA_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const isLoaded = dynamicGallery.length > 0;
  const activeDynamicGallery = dynamicGallery.filter(
    (g) => g.is_active !== 0 && g.is_active !== false && g.is_active !== "0"
  );

  const galleryImagesToDisplay = isLoaded
    ? activeDynamicGallery.map((g) => ({
        src: g.image_url,
        category: (g.category || "property") as FilterKey,
        alt: lang === "en" ? (g.title_en || g.title_id) : (g.title_id || g.title_en)
      }))
    : defaultGalleryImages;

  const filters = Object.entries(dict.gallery.filters) as [FilterKey, string][];

  const filtered =
    activeFilter === "all"
      ? galleryImagesToDisplay
      : galleryImagesToDisplay.filter((img) => img.category === activeFilter);

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

          {/* Bento Grid Layout */}
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-4 grid-flow-row-dense gap-3 sm:gap-4 lg:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => {
                const bentoSpan = getBentoSpan(i, filtered.length);

                return (
                  <motion.button
                    key={img.src + i}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    onClick={() => setLightbox(i)}
                    className={`group relative cursor-pointer block w-full rounded-xl sm:rounded-2xl overflow-hidden border border-border/30 bg-muted/20 shadow-xs hover:shadow-xl transition-all duration-300 ${bentoSpan}`}
                  >
                    <img
                      src={img.src || "/img/placeholder.svg"}
                      alt={img.alt || "Kasilapa Bay Gallery"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/placeholder.svg";
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay & Metadata */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 sm:p-5 text-left">
                      <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-gold mb-1">
                        {img.category}
                      </span>
                      <p className="text-white text-xs sm:text-base font-serif font-medium line-clamp-2">
                        {img.alt}
                      </p>
                    </div>

                    {/* Expand icon pill */}
                    <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 bg-black/50 backdrop-blur-md rounded-full p-1.5 sm:p-2 text-white border border-white/10">
                      <Maximize2 size={13} className="text-white/90" />
                    </div>
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
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/60 hover:text-white transition-colors z-10 p-2"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleLightboxNav("prev"); }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>

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
              src={filtered[lightbox]?.src || "/img/placeholder.svg"}
              alt={filtered[lightbox]?.alt || "Kasilapa Bay Gallery Image"}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/img/placeholder.svg";
              }}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm font-medium">
              {lightbox + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
