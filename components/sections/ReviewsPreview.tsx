"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

export default function ReviewsPreview({ dict }: Props) {
  const reviews = dict.reviews.items;
  // Double the reviews for seamless infinite marquee
  const duplicated = [...reviews, ...reviews];

  return (
    <section className="section-padding bg-surface relative overflow-hidden grain-overlay">
      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16 px-5 sm:px-6"
        >
          <span className="label-accent">{dict.reviews.title}</span>
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.15] mb-4 tracking-tight">
            {dict.reviews.subtitle}
          </h2>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-surface to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-surface to-transparent z-20 pointer-events-none" />

          {/* Scrolling track */}
          <div className="marquee-track flex gap-5 sm:gap-6 w-max">
            {duplicated.map((review, i) => (
              <div
                key={`${review.name}-${i}`}
                className="w-[320px] sm:w-[380px] flex-shrink-0 p-6 sm:p-7 bg-white rounded-xl border border-border-light shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Decorative quote */}
                  <div className="text-4xl text-gold/30 font-serif leading-none mb-3 select-none">
                    &ldquo;
                  </div>
                  <p className="text-foreground text-sm leading-relaxed font-normal line-clamp-4">
                    {review.comment}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border-light">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        className={
                          j < review.rating
                            ? "fill-gold text-gold"
                            : "text-border"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-light mt-0.5">
                    {review.origin}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
