"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
    <section className="relative h-screen min-h-[600px] flex items-end md:items-center pb-12 sm:pb-16 md:pb-0">
      {/* Background image */}
      <div className="absolute inset-0 bg-slate-900">
        <Image
          src="/img/hero.webp"
          alt="Kasilapa Bay Beachfront"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark gradient overlay tuned for mobile bottom-right and desktop left-center */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-slate-950/20 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/80 via-slate-950/30 to-transparent md:hidden" />
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-8 flex justify-end md:justify-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-xl text-right flex flex-col items-end md:text-left md:items-start"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-4 sm:mb-6 font-serif"
            style={{ color: "#ffffff" }}
          >
            {dict.hero.tagline}
          </h1>
          <p
            className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-md text-right md:text-left"
            style={{ color: "#ffffff" }}
          >
            {dict.hero.subtitle}
          </p>
          <a
            href={getWhatsAppUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-foreground px-6 py-3.5 text-sm font-medium tracking-wide uppercase hover:bg-white/90 transition-colors duration-200 shadow-md"
          >
            {dict.hero.cta}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
