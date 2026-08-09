"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";
import { getWhatsAppUrl } from "@/lib/utils";

type Props = {
  dict: Dictionary;
};

export default function CtaBanner({ dict }: Props) {
  return (
    <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/img/rooms/21.webp')" }}
      />

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-[#1a1714]/75" />

      {/* Wave divider top */}
      <div className="wave-divider">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,60 C300,20 600,60 900,20 C1050,0 1150,10 1200,20 L1200,0 L0,0 Z"
            fill="var(--color-surface)"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] uppercase text-gold/80 mb-6">
            Kasilapa Bay
          </span>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-white leading-[1.12] mb-6 font-bold tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {dict.contact.title}
          </h2>

          <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            {dict.contact.subtitle}
          </p>

          <a
            href={getWhatsAppUrl(dict.contact.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold shadow-lg"
          >
            {dict.contact.whatsapp}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
