"use client";

import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome =
    pathname === `/${lang}` ||
    pathname === `/${lang}/` ||
    pathname === "";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const otherLang = lang === "id" ? "en" : "id";
  const switchedPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-transparent border-b border-transparent text-white"
          : "bg-white/95 backdrop-blur-sm border-b border-border shadow-xs text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className={`text-lg font-bold tracking-[0.18em] uppercase transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-slate-900"
            }`}
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
                      ? isTransparent
                        ? "text-white font-bold border-b-2 border-white pb-0.5"
                        : "text-ocean-deep font-bold border-b-2 border-ocean-deep pb-0.5"
                      : isTransparent
                      ? "text-white/80 font-semibold hover:text-white"
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
              className={`flex items-center gap-1.5 text-[13px] tracking-wide uppercase px-3 py-1.5 transition-colors duration-200 rounded-xs border ${
                isTransparent
                  ? "border-white/40 bg-black/20 backdrop-blur-xs text-white hover:bg-black/30"
                  : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
              }`}
              aria-label={`Switch language to ${otherLang.toUpperCase()}`}
            >
              <span
                className={
                  lang === "id"
                    ? isTransparent
                      ? "text-white font-bold"
                      : "text-slate-900 font-bold"
                    : isTransparent
                    ? "text-white/60 font-medium"
                    : "text-slate-600 font-medium"
                }
              >
                ID
              </span>
              <span className={isTransparent ? "text-white/40" : "text-slate-400"}>|</span>
              <span
                className={
                  lang === "en"
                    ? isTransparent
                      ? "text-white font-bold"
                      : "text-slate-900 font-bold"
                    : isTransparent
                    ? "text-white/60 font-medium"
                    : "text-slate-600 font-medium"
                }
              >
                EN
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 -mr-2 transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-slate-900"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="lg:hidden border-t border-border bg-white text-slate-900 overflow-hidden shadow-md"
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
