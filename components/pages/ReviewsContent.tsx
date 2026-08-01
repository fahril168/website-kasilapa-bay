"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Dictionary } from "@/lib/i18n";

type Props = {
  dict: Dictionary;
};

export default function ReviewsContent({ dict }: Props) {
  const reviews = dict.reviews.items;

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          title={dict.reviews.title}
          subtitle={dict.reviews.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {reviews.map((review, i) => (
            <motion.blockquote
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className="p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-sm relative flex flex-col justify-between"
            >
              <div>
                <Quote
                  size={32}
                  className="text-ocean-deep opacity-30 mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-slate-800 text-base leading-relaxed mb-6 font-normal">
                  "{review.comment}"
                </p>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={15}
                      className={
                        j < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <footer>
                  <p className="text-base font-bold text-slate-900">
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
