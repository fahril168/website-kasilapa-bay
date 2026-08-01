"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

export default function ReviewsPreview({ dict }: Props) {
  const reviews = dict.reviews.items.slice(0, 3);

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          title={dict.reviews.title}
          subtitle={dict.reviews.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.blockquote
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
              className="p-5 sm:p-6 bg-slate-50 border border-slate-200 rounded-sm relative flex flex-col justify-between"
            >
              <div>
                <Quote
                  size={30}
                  className="text-ocean-deep opacity-30 mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-slate-800 text-sm leading-relaxed mb-6 font-normal">
                  "{review.comment}"
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={13}
                      className={
                        j < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <footer>
                  <p className="text-sm font-bold text-slate-900">
                    {review.name}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{review.origin}</p>
                </footer>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
