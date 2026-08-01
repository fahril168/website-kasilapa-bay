"use client";

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
    <section className="relative h-[100svh] min-h-[600px] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0 bg-slate-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/img/hero.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Subtle dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:hidden" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-xl"
        >
          {/* <p className="text-white/60 text-[11px] tracking-[0.3em] uppercase mb-4">
            Tomia Island · Wakatobi · Indonesia
          </p> */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-4 sm:mb-6"
            style={{ color: "#ffffff" }}
          >
            {dict.hero.tagline}
          </h1>
          <p
            className="text-white/90 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10 max-w-md"
            style={{ color: "#ffffff" }}
          >
            {dict.hero.subtitle}
          </p>
          <a
            href={getWhatsAppUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-foreground px-6 py-3.5 text-sm font-medium tracking-wide uppercase hover:bg-white/90 transition-colors duration-200"
          >
            {dict.hero.cta}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
