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
    <section className="bg-foreground">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <p className="text-white/40 text-[11px] tracking-[0.3em] uppercase mb-4">
            Kasilapa Bay
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] mb-6"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {dict.contact.title}
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-10">
            {dict.contact.subtitle}
          </p>
          <a
            href={getWhatsAppUrl(dict.contact.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-foreground px-6 py-3.5 text-sm font-medium tracking-wide uppercase hover:bg-white/90 transition-colors duration-200"
          >
            {dict.contact.whatsapp}
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
