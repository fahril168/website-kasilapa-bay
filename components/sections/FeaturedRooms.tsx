"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, BedDouble, Eye, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Locale, Dictionary } from "@/lib/i18n";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

export default function FeaturedRooms({ dict, lang }: Props) {
  const rooms = dict.accommodation.rooms;

  return (
    <section className="section-padding bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeader
          title={dict.accommodation.title}
          subtitle={dict.accommodation.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {rooms.map((room, i) => {
            const waMessage =
              lang === "id"
                ? `Halo, saya ingin memesan ${room.name} di Kasilapa Bay. Mohon informasikan ketersediaannya.`
                : `Hello, I'd like to book the ${room.name} at Kasilapa Bay. Could you check availability?`;

            return (
              <motion.div
                key={room.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group bg-slate-50 border border-slate-200 hover:border-ocean-deep/50 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Image placeholder with zoom animation on hover */}
                  <div className="aspect-[4/3] bg-surface relative overflow-hidden">
                    <div
                      className="w-full h-full group-hover:scale-108 transition-transform duration-700 ease-out"
                      style={{
                        backgroundImage: `url('${
                          i === 0
                            ? "/img/rooms/6.webp"
                            : i === 1
                            ? "/img/rooms/12.webp"
                            : "/img/rooms/3.webp"
                        }')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 lg:p-8">
                    <h3
                      className="text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-ocean-deep transition-colors duration-200 mb-2.5"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {room.name}
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed mb-6 font-normal">
                      {room.description}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700 mb-6">
                      <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1">
                        <Users size={13} className="text-ocean-deep" />
                        {room.capacity} {dict.accommodation.guests}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1">
                        <BedDouble size={13} className="text-ocean-deep" />
                        {room.bed}
                      </span>
                      <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1">
                        <Eye size={13} className="text-ocean-deep" />
                        {room.view}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="px-5 sm:px-6 lg:px-8 pb-5 sm:pb-6 lg:pb-8 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 bg-white group-hover:bg-slate-50/50 transition-colors duration-200">
                  <div>
                    <span className="text-xl font-bold text-slate-900">
                      {formatPrice(room.price)}
                    </span>
                    <span className="text-slate-600 text-xs font-medium ml-1">
                      {dict.accommodation.perNight}
                    </span>
                  </div>
                  <a
                    href={getWhatsAppUrl(waMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ocean-deep text-xs font-bold tracking-wider uppercase hover:text-ocean transition-colors duration-200"
                  >
                    <span>{dict.accommodation.bookCta}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            href={`/${lang}/akomodasi`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-ocean-deep transition-colors duration-200 tracking-wide uppercase group"
          >
            <span>{dict.common.viewAll}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
