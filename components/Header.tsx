"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

type HeaderProps = {
  lang: Locale;
  dict: Dictionary;
};

const navKeys = [
  { key: "home", href: "" },
  { key: "accommodation", href: "/akomodasi" },
  { key: "destination", href: "/destinasi" },
  { key: "gallery", href: "/galeri" },
  { key: "reviews", href: "/ulasan" },
  { key: "contact", href: "/kontak" },
] as const;

export default function Header({ lang, dict }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const otherLang = lang === "id" ? "en" : "id";
  const switchedPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="text-lg font-bold tracking-[0.18em] text-slate-900 uppercase"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Kasilapa Bay
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navKeys.map(({ key, href }) => {
              const fullHref = `/${lang}${href}`;
              const isActive =
                href === ""
                  ? pathname === `/${lang}` || pathname === `/${lang}/`
                  : pathname.startsWith(fullHref);

              return (
                <Link
                  key={key}
                  href={fullHref}
                  className={`text-[13px] tracking-wide uppercase transition-colors duration-200 ${
                    isActive
                      ? "text-ocean-deep font-bold border-b-2 border-ocean-deep pb-0.5"
                      : "text-slate-600 font-semibold hover:text-slate-900"
                  }`}
                >
                  {dict.nav[key as keyof typeof dict.nav]}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Language Switcher + Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <Link
              href={switchedPath}
              className="flex items-center gap-1.5 text-[13px] tracking-wide uppercase border border-slate-300 px-3 py-1.5 bg-white hover:bg-slate-50 transition-colors duration-200 rounded-xs"
              aria-label={`Switch language to ${otherLang.toUpperCase()}`}
            >
              <span
                className={lang === "id" ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}
              >
                ID
              </span>
              <span className="text-slate-400">|</span>
              <span
                className={lang === "en" ? "text-slate-900 font-bold" : "text-slate-600 font-medium"}
              >
                EN
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -mr-2 text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden border-t border-border bg-white overflow-hidden shadow-md"
          >
            <nav className="px-6 py-6 flex flex-col gap-4">
              {navKeys.map(({ key, href }) => {
                const fullHref = `/${lang}${href}`;
                const isActive =
                  href === ""
                    ? pathname === `/${lang}` || pathname === `/${lang}/`
                    : pathname.startsWith(fullHref);

                return (
                  <Link
                    key={key}
                    href={fullHref}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm tracking-wide uppercase transition-colors duration-200 ${
                      isActive
                        ? "text-ocean-deep font-bold"
                        : "text-slate-600 font-medium hover:text-slate-900"
                    }`}
                  >
                    {dict.nav[key as keyof typeof dict.nav]}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
