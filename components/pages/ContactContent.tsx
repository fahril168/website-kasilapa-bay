"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageSquare, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Locale, Dictionary } from "@/lib/i18n";
import { WHATSAPP_NUMBER, getWhatsAppUrl } from "@/lib/utils";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

export default function ContactContent({ dict }: Props) {
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
                href={getWhatsAppUrl(dict.contact.whatsappMessage)}
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
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-light border border-border-light text-gold rounded-lg">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-light mb-1">
                    {dict.contact.phone}
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground text-base font-bold hover:text-accent transition-colors"
                  >
                    +62 821-1234-5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-light border border-border-light text-gold rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-light mb-1">
                    {dict.contact.email}
                  </p>
                  <a
                    href="mailto:hello@kasilapabay.com"
                    className="text-foreground text-base font-bold hover:text-accent transition-colors"
                  >
                    hello@kasilapabay.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-gold-light border border-border-light text-gold rounded-lg">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-muted-light mb-1">
                    {dict.contact.address}
                  </p>
                  <p className="text-foreground text-sm leading-relaxed font-medium">
                    {dict.contact.addressValue}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31758.123456789!2d123.950000!3d-5.750000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2da8000000000000%3A0x0!2zNcKwNDUnMDAuMCJTIDEyM8KwNTcnMDAuMCJF!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid"
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
