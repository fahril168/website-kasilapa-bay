"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

export default function ReviewsContent({ dict }: Props) {
  const reviews = dict.reviews.items;

  return (
    <section className="pt-16 section-padding bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          label="Kasilapa Bay"
          title={dict.reviews.title}
          subtitle={dict.reviews.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.blockquote
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 2) * 0.1 }}
              className="p-6 sm:p-8 bg-surface border border-border-light rounded-xl relative flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                {/* Decorative quote */}
                <div className="text-5xl text-gold/25 font-serif leading-none mb-3 select-none">
                  &ldquo;
                </div>
                <p className="text-foreground text-base leading-relaxed mb-6 font-normal">
                  {review.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-border-light">
                {/* Stars */}
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
