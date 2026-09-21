"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData, setStoredData } from "@/lib/storage";

type Props = {
  dict: Dictionary;
  lang?: Locale;
};

function formatDistance(distStr: string, isEn: boolean): string {
  if (!distStr || !isEn) return distStr || "";
  return distStr
    .replace(/menit berkendara/gi, "min drive")
    .replace(/menit perahu/gi, "min by boat")
    .replace(/menit jalan kaki/gi, "min walk")
    .replace(/menit/gi, "mins");
}

function formatCategory(cat: string, isEn: boolean): string {
  if (!cat || !isEn) return cat || "Nature";
  const map: Record<string, string> = {
    "Pemandangan Alam": "Scenic Views",
    "Alam": "Nature",
    "Sejarah & Budaya": "History & Culture",
    "Pantai": "Beach",
    "Diving": "Diving",
    "Kuliner": "Culinary",
  };
  return map[cat] || cat;
}

export default function DestinationContent({ dict, lang = "id" }: Props) {
  const [dynamicPlaces, setDynamicPlaces] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initial load from local persistent storage
    const stored = getStoredData<any[]>(STORAGE_KEYS.DESTINATIONS, []);
    if (Array.isArray(stored) && stored.length > 0) {
      setDynamicPlaces(stored);
    }

    // 2. Real-time sync listener
    const handleSync = () => {
      const updated = getStoredData<any[]>(STORAGE_KEYS.DESTINATIONS, []);
      if (Array.isArray(updated) && updated.length > 0) {
        setDynamicPlaces(updated);
      }
    };
    window.addEventListener(DATA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Background fetch from API
    fetch(getApiUrl("/api/destinasi.php"))
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setDynamicPlaces(json.data);
          setStoredData(STORAGE_KEYS.DESTINATIONS, json.data);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener(DATA_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const placesToDisplay = dynamicPlaces.map((d) => ({
        name: (lang === "en" ? d.name_en : d.name_id) || d.name_id || d.name_en || "Destinasi Wisata",
        category: formatCategory(d.category, lang === "en"),
        description: (lang === "en" ? d.description_en : d.description_id) || d.description_id || d.description_en || "",
        distance: formatDistance(d.distance, lang === "en"),
        image: d.image_url || "/img/placeholder.svg",
        url: d.info_url || "#"
  }));

  if (placesToDisplay.length === 0) return null;

  return (
    <section className="pt-16 section-padding bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          label="Wakatobi"
          title={dict.destination.title}
          subtitle={dict.destination.subtitle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {placesToDisplay.map((place: any, i: number) => (
            <motion.a
              key={place.name + i}
              href={place.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.1 }}
              className={`group relative rounded-xl overflow-hidden cursor-pointer block ${
                i === 0
                  ? "sm:col-span-2 lg:col-span-2 aspect-[16/9]"
                  : i === 1
                  ? "aspect-[4/3] lg:aspect-[8/9]"
                  : i === 6
                  ? "sm:col-span-2 lg:col-span-2 aspect-[16/9] lg:aspect-[8/3]"
                  : "aspect-[4/3]"
              }`}
            >
              {/* Image with fallback */}
              <img
                src={place.image || "/img/placeholder.svg"}
                alt={place.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/img/placeholder.svg";
                }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
