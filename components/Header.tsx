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
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const otherLang = lang === "id" ? "en" : "id";
  const switchedPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "bg-transparent text-white"
          : "bg-background/95 backdrop-blur-md border-b border-border text-foreground shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[4.25rem] items-center justify-between">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2 group"
          >
            <span
              className={`text-lg font-bold tracking-[0.15em] uppercase transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-foreground"
              }`}
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Kasilapa Bay
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
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
                  className={`relative text-[13px] tracking-wide uppercase px-3.5 py-2 rounded-sm transition-colors duration-200 ${
                    isActive
                      ? isTransparent
                        ? "text-white font-bold"
                        : "text-accent font-bold"
                      : isTransparent
                      ? "text-white/70 font-medium hover:text-white"
                      : "text-muted font-medium hover:text-foreground"
                  }`}
                >
                  {dict.nav[key as keyof typeof dict.nav]}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full ${
                        isTransparent ? "bg-gold" : "bg-gold"
                      }`}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <Link
              href={switchedPath}
              className={`flex items-center gap-1.5 text-[13px] tracking-wide uppercase px-3 py-1.5 transition-all duration-200 rounded-full border ${
                isTransparent
                  ? "border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                  : "border-border bg-surface text-foreground hover:border-gold hover:text-gold"
              }`}
              aria-label={`Switch language to ${otherLang.toUpperCase()}`}
            >
              <span
                className={
                  lang === "id"
                    ? "font-bold"
                    : "opacity-50 font-medium"
                }
              >
                ID
              </span>
              <span className="opacity-30">|</span>
              <span
                className={
                  lang === "en"
                    ? "font-bold"
                    : "opacity-50 font-medium"
                }
              >
                EN
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 -mr-2 transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-foreground"
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
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-border bg-background text-foreground overflow-hidden"
          >
            <nav className="px-6 py-6 flex flex-col gap-1">
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
                    className={`text-sm tracking-wide uppercase py-2.5 px-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "text-accent font-bold bg-accent-light"
                        : "text-muted font-medium hover:text-foreground hover:bg-surface"
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
