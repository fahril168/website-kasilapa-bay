"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getWhatsAppUrl } from "@/lib/utils";
import { useDynamicSettings } from "@/lib/hooks/useDynamicSettings";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

export default function HeroSection({ dict, lang }: Props) {
  const { whatsappNumber } = useDynamicSettings();

  const waMessage =
    lang === "id"
      ? "Halo, saya tertarik untuk menginap di Kasilapa Bay. Bisa tolong informasikan ketersediaan kamar?"
      : "Hello, I'm interested in staying at Kasilapa Bay. Could you let me know about room availability?";

  return (
    <section className="relative h-screen min-h-[650px] flex items-center justify-center overflow-hidden">
      {/* Background image with responsive picture for mobile & desktop */}
      <div className="absolute inset-0">
        <picture className="w-full h-full">
          <source media="(max-width: 767px)" srcSet="/img/hero-mobile.webp" type="image/webp" />
          <source media="(min-width: 768px)" srcSet="/img/hero.webp" type="image/webp" />
          <img
            src="/img/hero.webp"
            alt="Kasilapa Bay Beachfront"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Warm cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1714]/90 via-[#1a1714]/30 to-[#1a1714]/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1a1714]/40 to-transparent pointer-events-none" />

      {/* Content — Rendered immediately without blocking delays for optimal LCP */}
      <div className="relative z-10 mx-auto max-w-5xl w-full px-5 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Location label */}
        <span className="inline-block text-[11px] sm:text-xs font-bold tracking-[0.3em] uppercase text-white/60 mb-6">
          Tomia Island · Wakatobi
        </span>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white leading-[1.05] mb-6 font-serif font-bold tracking-tight">
          {dict.hero.tagline}
        </h1>

        {/* Subtitle */}
        <p className="text-white/70 text-sm sm:text-base lg:text-lg leading-relaxed mb-10 max-w-lg mx-auto font-normal">
          {dict.hero.subtitle}
        </p>

        {/* CTA button with dynamic WA number */}
        <a
          href={getWhatsAppUrl(waMessage, whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold shadow-lg"
        >
          {dict.hero.cta}
          <ArrowRight size={16} />
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <ChevronDown size={20} className="text-white/40 scroll-indicator" />
      </div>
    </section>
  );
}
