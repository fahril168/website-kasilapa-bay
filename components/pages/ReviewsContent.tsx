"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData, setStoredData } from "@/lib/storage";

type Props = {
  dict: Dictionary;
  lang?: Locale;
};

export default function ReviewsContent({ dict, lang = "id" }: Props) {
  const [dynamicReviews, setDynamicReviews] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initial load from local persistent storage
    const stored = getStoredData<any[]>(STORAGE_KEYS.REVIEWS, []);
    if (Array.isArray(stored) && stored.length > 0) {
      setDynamicReviews(stored.filter((r: any) => Number(r.is_visible) === 1));
    }

    // 2. Real-time sync listener
    const handleSync = () => {
      const updated = getStoredData<any[]>(STORAGE_KEYS.REVIEWS, []);
      if (Array.isArray(updated) && updated.length > 0) {
        setDynamicReviews(updated.filter((r: any) => Number(r.is_visible) === 1));
      }
    };
    window.addEventListener(DATA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Background fetch from API
    fetch(getApiUrl("/api/ulasan.php"))
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setDynamicReviews(json.data.filter((r: any) => Number(r.is_visible) === 1));
          setStoredData(STORAGE_KEYS.REVIEWS, json.data);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener(DATA_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const reviewsToDisplay = dynamicReviews.map((r) => ({
        name: r.guest_name,
        origin: r.origin,
        rating: r.rating,
        comment: lang === "en" ? r.comment_en : r.comment_id
  }));

  if (reviewsToDisplay.length === 0) return null;

  return (
    <section className="pt-24 section-padding bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          label="Kasilapa Bay"
          title={dict.reviews.title}
          subtitle={dict.reviews.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {reviewsToDisplay.map((review: any, i: number) => (
            <motion.blockquote
              key={review.name + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 2) * 0.1 }}
              className="p-6 sm:p-8 bg-surface border border-border-light rounded-xl relative flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <div className="text-5xl text-gold/25 font-serif leading-none mb-3 select-none">
                  &ldquo;
                </div>
                <p className="text-foreground text-base leading-relaxed mb-6 font-normal">
                  {review.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-border-light">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={15}
                      className={
                        j < review.rating
                          ? "fill-gold text-gold"
                          : "text-border"
                      }
                    />
                  ))}
                </div>
                <footer>
                  <p className="text-base font-bold text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-light mt-0.5">
                    {review.origin}
                  </p>
                </footer>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
