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
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          title={dict.contact.title}
          subtitle={dict.contact.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Contact Details & WhatsApp Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-slate-50 p-6 sm:p-8 border border-slate-200 rounded-sm">
              <h3
                className="text-2xl font-bold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {dict.contact.whatsapp}
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed mb-6 font-normal">
                {dict.contact.subtitle}
              </p>
              <a
                href={getWhatsAppUrl(dict.contact.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 bg-ocean-deep text-white px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide uppercase hover:bg-ocean transition-colors duration-200 rounded-xs"
              >
                <MessageSquare size={18} />
                {dict.contact.whatsapp}
                <ArrowRight size={16} />
              </a>
            </div>

            <div className="space-y-6 px-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 border border-slate-200 text-ocean-deep rounded-xs">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">
                    {dict.contact.phone}
                  </p>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 text-base font-bold hover:text-ocean-deep transition-colors"
                  >
                    +62 821-1234-5678
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 border border-slate-200 text-ocean-deep rounded-xs">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">
                    {dict.contact.email}
                  </p>
                  <a
                    href="mailto:hello@kasilapabay.com"
                    className="text-slate-900 text-base font-bold hover:text-ocean-deep transition-colors"
                  >
                    hello@kasilapabay.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 border border-slate-200 text-ocean-deep rounded-xs">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mb-1">
                    {dict.contact.address}
                  </p>
                  <p className="text-slate-800 text-sm leading-relaxed font-medium">
                    {dict.contact.addressValue}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Google Map Embed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-[300px] sm:h-[400px] lg:h-[450px] bg-slate-100 border border-slate-200 rounded-sm overflow-hidden relative"
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
