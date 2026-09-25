"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { useDynamicSettings } from "@/lib/hooks/useDynamicSettings";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData } from "@/lib/storage";
import { getApiUrl } from "@/lib/utils";

type Props = {
  dict: Dictionary;
  lang?: Locale;
};

const defaultAboutImages = [
  { src: "/img/room.webp", alt: "Kasilapa Bay Resort" },
  { src: "/img/hero.webp", alt: "Kasilapa Bay View" },
];

export default function AboutSection({ dict, lang = "id" }: Props) {
  const { settings } = useDynamicSettings();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stepWidth, setStepWidth] = useState(300);

  // Dynamic stats calculated from real database storage
  const [statsData, setStatsData] = useState({
    rooms: 2,
    destinations: 10,
    rating: "4.9",
  });

  useEffect(() => {
    const updateStats = () => {
      const rooms = getStoredData<any[]>(STORAGE_KEYS.ROOMS, []);
      const dests = getStoredData<any[]>(STORAGE_KEYS.DESTINATIONS, []);
      const revs = getStoredData<any[]>(STORAGE_KEYS.REVIEWS, []);

      const roomCount = rooms.length > 0 ? rooms.length : 2;
      const destCount = dests.length > 0 ? dests.length : 10;
      let ratingStr = "4.9";
      if (revs.length > 0) {
        const sum = revs.reduce((acc, r) => acc + Number(r.rating || 5), 0);
        ratingStr = (sum / revs.length).toFixed(1);
      }
      setStatsData({ rooms: roomCount, destinations: destCount, rating: ratingStr });
    };

    updateStats();
    window.addEventListener(DATA_SYNC_EVENT, updateStats);
    window.addEventListener("storage", updateStats);
    return () => {
      window.removeEventListener(DATA_SYNC_EVENT, updateStats);
      window.removeEventListener("storage", updateStats);
    };
  }, []);

  // Dynamic Headline and Description from Hostinger MySQL API
  const dynamicHeadline = lang === "en" 
    ? (settings?.about_headline_en || dict.about.headline)
    : (settings?.about_headline_id || dict.about.headline);

  const dynamicDescription = lang === "en"
    ? (settings?.about_description_en || dict.about.description)
    : (settings?.about_description_id || dict.about.description);

  // Fallback: If no explicit about_images in settings, fetch active gallery property photos
  useEffect(() => {
    if (settings?.about_images && Array.isArray(settings.about_images) && settings.about_images.length > 0) {
      return;
    }
    const cachedGallery = getStoredData<any[]>(STORAGE_KEYS.GALLERY, []);
    if (Array.isArray(cachedGallery) && cachedGallery.length > 0) {
      const activeUrls = cachedGallery
        .filter((g) => g.is_active !== 0 && g.is_active !== false && g.image_url)
        .map((g) => g.image_url);
      if (activeUrls.length > 0) {
        setGalleryImages(activeUrls);
      }
    } else {
      fetch(getApiUrl("/api/galeri.php"))
        .then((res) => (res.ok ? res.json() : null))
        .then((json) => {
          if (json?.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
            const activeUrls = json.data
              .filter((g: any) => g.is_active !== 0 && g.is_active !== false && (g.url || g.image_url))
              .map((g: any) => g.url || g.image_url);
            if (activeUrls.length > 0) {
              setGalleryImages(activeUrls);
            }
          }
        })
        .catch(() => {});
    }
  }, [settings?.about_images]);

  // Determine active images to display in slider
  const chosenImages = (settings?.about_images && Array.isArray(settings.about_images) && settings.about_images.length > 0)
    ? settings.about_images.map((url, i) => ({ src: url, alt: `Kasilapa Bay ${i + 1}` }))
    : galleryImages.length > 0
      ? galleryImages.map((url, i) => ({ src: url, alt: `Kasilapa Bay ${i + 1}` }))
      : defaultAboutImages;

  const totalImages = chosenImages.length;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setStepWidth(containerWidth * 0.83 + 16);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Reset currentIndex if totalImages changes
  useEffect(() => {
    if (currentIndex >= totalImages) {
      setCurrentIndex(0);
    }
  }, [totalImages, currentIndex]);

  useEffect(() => {
    if (isHovered || totalImages <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, totalImages]);

  return (
    <section className="section-padding bg-surface relative overflow-hidden grain-overlay">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column: Headline & Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 text-left"
          >
            <span className="label-accent">Kasilapa Bay</span>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.12] mb-6 tracking-tight font-serif">
              {dynamicHeadline}
            </h2>

            {/* Gold accent divider */}
            <div className="w-12 h-0.5 bg-gold mb-6" />

            <p className="text-muted text-base sm:text-lg leading-relaxed font-normal mb-10">
              {dynamicDescription}
            </p>

            {/* Stats row (Dynamically synced from database) */}
            <div className="flex items-center gap-8">
              {[
                { value: String(statsData.rooms), labelId: "Tipe Kamar", labelEn: "Room Types" },
                { value: String(statsData.destinations), labelId: "Destinasi", labelEn: "Destinations" },
                { value: statsData.rating, labelId: "Rating Tamu", labelEn: "Guest Rating" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground font-serif">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted font-medium tracking-wide mt-1">
                    {lang === "en" ? stat.labelEn : stat.labelId}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Image Track */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-7 relative w-full overflow-visible select-none group"
          >
            <div className="overflow-hidden w-full lg:w-[calc(100%+20vw)] lg:pr-[20vw]">
              <motion.div
                animate={{ x: -currentIndex * stepWidth }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="flex gap-4 sm:gap-5 w-full"
              >
                {chosenImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-[83%] flex-shrink-0 relative aspect-[4/3] rounded-lg overflow-hidden bg-dark shadow-xl"
                  >
                    <img
                      src={img.src || "/img/hero.webp"}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/img/hero.webp";
                      }}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/50 via-transparent to-transparent pointer-events-none z-10" />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Controls (Only shown if more than 1 image) */}
            {totalImages > 1 && (
              <div className="absolute bottom-4 left-0 w-[83%] flex items-center justify-between px-4 z-30 pointer-events-auto">
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (prev) => (prev - 1 + totalImages) % totalImages
                    )
                  }
                  className="p-2 rounded-full bg-[#1a1714]/60 hover:bg-gold text-white backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1.5 bg-[#1a1714]/50 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  {chosenImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentIndex === i
                          ? "w-6 bg-gold"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % totalImages)
                  }
                  className="p-2 rounded-full bg-[#1a1714]/60 hover:bg-gold text-white backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
