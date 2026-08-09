import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";

type FooterProps = {
  lang: Locale;
  dict: Dictionary;
};

const WHATSAPP_NUMBER = "6282112345678";

const navKeys = [
  { key: "home", href: "" },
  { key: "accommodation", href: "/akomodasi" },
  { key: "destination", href: "/destinasi" },
  { key: "gallery", href: "/galeri" },
  { key: "reviews", href: "/ulasan" },
  { key: "contact", href: "/kontak" },
] as const;

export default function Footer({ lang, dict }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p
              className="text-white text-lg font-bold tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Kasilapa Bay
            </p>
            <p className="text-sm leading-relaxed text-white/50 max-w-xs font-normal">
              {dict.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-5">
              {dict.footer.quickLinks}
            </p>
            <nav className="flex flex-col gap-3">
              {navKeys.map(({ key, href }) => (
                <Link
                  key={key}
                  href={`/${lang}${href}`}
                  className="text-sm text-white/50 hover:text-gold font-medium transition-colors duration-200"
                >
                  {dict.nav[key as keyof typeof dict.nav]}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-5">
              {dict.footer.contactInfo}
            </p>
            <div className="flex flex-col gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-white/50 hover:text-gold font-medium transition-colors duration-200"
              >
                <Phone size={16} className="mt-0.5 shrink-0 text-gold/70" />
                <span>+62 821-1234-5678</span>
              </a>
              <a
                href="mailto:hello@kasilapabay.com"
                className="flex items-start gap-3 text-sm text-white/50 hover:text-gold font-medium transition-colors duration-200"
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-gold/70" />
                <span>hello@kasilapabay.com</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-white/50 font-normal">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold/70" />
                <span>{dict.contact.addressValue}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <p className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-5">
              {dict.footer.followUs}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/kasilapabay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-gold font-medium transition-colors duration-200"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com/kasilapabay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-gold font-medium transition-colors duration-200"
              >
                Facebook
              </a>
              <a
                href="https://tiktok.com/@kasilapabay"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-gold font-medium transition-colors duration-200"
              >
                TikTok
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 font-medium">
            © {year} Kasilapa Bay. {dict.footer.rights}
          </p>
          <p className="text-xs text-white/30 font-medium">
            Tomia Island, Wakatobi, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
