"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getWhatsAppUrl } from "@/lib/utils";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

export default function HeroSection({ dict, lang }: Props) {
  const waMessage =
    lang === "id"
      ? "Halo, saya tertarik untuk menginap di Kasilapa Bay. Bisa tolong informasikan ketersediaan kamar?"
      : "Hello, I'm interested in staying at Kasilapa Bay. Could you let me know about room availability?";

  return (
    <section className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden">
      {/* Background image with subtle scale */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0"
      >
        <Image
          src="/img/hero.webp"
          alt="Kasilapa Bay Beachfront"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Warm cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/90 via-[#1a1714]/30 to-[#1a1714]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-5 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Location label */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-white/60 mb-6"
        >
          Tomia Island · Wakatobi
        </motion.span>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.05] mb-6 font-serif font-bold tracking-tight"
        >
          {dict.hero.tagline}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed mb-10 max-w-lg mx-auto font-normal"
        >
          {dict.hero.subtitle}
        </motion.p>

        {/* CTA button */}
        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          href={getWhatsAppUrl(waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold shadow-lg"
        >
          {dict.hero.cta}
          <ArrowRight size={16} />
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <ChevronDown size={20} className="text-white/40 scroll-indicator" />
      </motion.div>
    </section>
  );
}
