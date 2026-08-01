"use client";

import { motion } from "framer-motion";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-10 lg:mb-14 ${
        align === "center" ? "text-center max-w-2xl mx-auto" : ""
      }`}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-600 text-base lg:text-lg leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
