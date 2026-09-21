"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Locale, Dictionary } from "@/lib/i18n";
import { getWhatsAppUrl, formatPhoneNumber } from "@/lib/utils";
import { useDynamicContacts } from "@/lib/hooks/useDynamicSettings";

function InstagramIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

type Props = {
  dict: Dictionary;
  lang: Locale;
};

export default function ContactContent({ dict }: Props) {
  const { phonePrimary, phoneSecondary, instagramUrl, instagramUsername, address } = useDynamicContacts();

  return (
    <section className="pt-16 section-padding bg-background">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          label="Kasilapa Bay"
          title={dict.contact.title}
          subtitle={dict.contact.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Details & WhatsApp Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {/* WhatsApp CTA Card */}
            <div className="bg-surface p-6 sm:p-8 border border-border rounded-xl">
              <h3 className="text-2xl font-bold text-foreground mb-3 font-serif">
                {dict.contact.whatsapp}
              </h3>
              <p className="text-muted text-sm leading-relaxed mb-6 font-normal">
                {dict.contact.subtitle}
              </p>
              <a
                href={getWhatsAppUrl(dict.contact.whatsappMessage, phonePrimary)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs"
              >
                <MessageSquare size={18} />
                {dict.contact.whatsapp}
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Contact Info */}
            <div className="space-y-6 px-2">
              {/* Nomor Utama */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-light border border-border-light text-gold rounded-lg shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs uppercase font-bold tracking-wider text-muted-light">
                      {dict.contact.phonePrimary}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`https://wa.me/${phonePrimary}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground text-base font-bold hover:text-gold transition-colors"
                    >
                      {formatPhoneNumber(phonePrimary)}
                    </a>
                  </div>
                </div>
              </div>

              {/* Nomor Kedua / Cadangan */}
              {phoneSecondary ? (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold-light border border-border-light text-gold rounded-lg shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs uppercase font-bold tracking-wider text-muted-light">
                        {dict.contact.phoneSecondary}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`https://wa.me/${phoneSecondary}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground text-base font-bold hover:text-gold transition-colors"
                      >
                        {formatPhoneNumber(phoneSecondary)}
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Instagram */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-light border border-border-light text-gold rounded-lg shrink-0">
                  <InstagramIcon size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-light mb-1">
                    {dict.contact.instagram || "Instagram"}
                  </p>
                  <a
                    href={instagramUrl || "https://instagram.com/kasilapahoteltomia"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground text-base font-bold hover:text-gold transition-colors"
                  >
                    {instagramUsername || "@kasilapahoteltomia"}
                  </a>
                </div>
              </div>

              {/* Alamat */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-light border border-border-light text-gold rounded-lg shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-light mb-1">
                    {dict.contact.address}
                  </p>
                  <p className="text-foreground text-sm leading-relaxed font-medium">
                    {address || dict.contact.addressValue}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-[300px] sm:h-[400px] lg:h-[480px] bg-surface border border-border rounded-xl overflow-hidden relative"
          >
            <iframe
              title="Kasilapa Bay Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d281.21142835228903!2d123.92039803533605!3d-5.7720609921013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2da7051ead503aab%3A0xe09e8591a58f4101!2sKasilapa%20Bay%20Hotel!5e1!3m2!1sen!2sid!4v1786279501117!5m2!1sen!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
