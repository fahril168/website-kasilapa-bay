"use client";

import { motion } from "framer-motion";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  label?: string;
  align?: "left" | "center";
  dark?: boolean;
};

export default function SectionHeader({
  title,
  subtitle,
  label,
  align = "center",
  dark = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`mb-12 lg:mb-16 ${
        align === "center" ? "text-center max-w-2xl mx-auto" : ""
      }`}
    >
      {label && (
        <span className="label-accent">{label}</span>
      )}
      <h2
        className={`text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] mb-4 tracking-tight ${
          dark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base lg:text-lg leading-relaxed font-normal max-w-xl ${
            align === "center" ? "mx-auto" : ""
          } ${dark ? "text-white/60" : "text-muted"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
