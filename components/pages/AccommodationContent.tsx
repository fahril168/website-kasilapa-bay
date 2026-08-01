"use client";

import { motion } from "framer-motion";
import {
  Users,
  BedDouble,
  Eye,
  ArrowRight,
  Wifi,
  UtensilsCrossed,
  Waves,
  Car,
  WashingMachine,
  Zap,
  Droplets,
  Motorbike,
  SquareParking,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import type { Locale, Dictionary } from "@/lib/i18n";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const facilityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi size={20} />,
  breakfast: <UtensilsCrossed size={20} />,
  car: <Car size={20} />,
  bike: <Motorbike size={20} />,
  parking: <SquareParking size={20} />,
  laundry: <WashingMachine size={20} />,
  electricity: <Zap size={20} />,
  water: <Droplets size={20} />,
};

export default function AccommodationContent({ dict, lang }: Props) {
  const rooms = dict.accommodation.rooms;
  const facilities = dict.accommodation.facilitiesList;

  return (
    <>
      {/* Page Header */}
      <section className="pt-16 section-padding bg-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeader
            title={dict.accommodation.title}
            subtitle={dict.accommodation.subtitle}
          />

          {/* Rooms */}
          <div className="space-y-12">
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
                  whileHover={{ y: -4 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.1 }}
                  className="group bg-slate-50 border border-slate-200 hover:border-ocean-deep/50 grid grid-cols-1 lg:grid-cols-2 rounded-sm overflow-hidden shadow-xs hover:shadow-xl transition-colors transition-shadow duration-300"
                >
                  {/* Image with zoom on hover */}
                  <div
                    className={`aspect-[4/3] lg:aspect-auto bg-surface overflow-hidden relative ${
                      i % 2 === 1 ? "lg:order-2" : ""
                    }`}
                  >
                    <div
                      className="w-full h-full min-h-[240px] sm:min-h-[320px] group-hover:scale-106 transition-transform duration-700 ease-out"
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

                  {/* Details */}
                  <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                    <h3
                      className="text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-ocean-deep transition-colors duration-200 mb-3"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {room.name}
                    </h3>
                    <p className="text-slate-700 text-base leading-relaxed mb-6 font-normal">
                      {room.description}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-6 text-sm text-slate-700 font-medium mb-8 pb-6 border-b border-slate-200">
                      <span className="flex items-center gap-2">
                        <Users size={16} className="text-ocean-deep" />
                        {room.capacity} {dict.accommodation.guests}
                      </span>
                      <span className="flex items-center gap-2">
                        <BedDouble size={16} className="text-ocean-deep" />
                        {room.bed}
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye size={16} className="text-ocean-deep" />
                        {room.view}
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between flex-wrap gap-4">
                      <div>
                        <span
                          className="text-2xl font-bold text-slate-900"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {formatPrice(room.price)}
                        </span>
                        <span className="text-slate-600 text-sm font-medium ml-1.5">
                          {dict.accommodation.perNight}
                        </span>
                      </div>
                      <a
                        href={getWhatsAppUrl(waMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-ocean-deep group-hover:bg-ocean text-white px-5 py-3 text-sm font-semibold tracking-wide uppercase transition-colors duration-200 rounded-xs shadow-sm group-hover:shadow-md"
                      >
                        <span>{dict.accommodation.bookCta}</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="section-padding bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader title={dict.accommodation.facilities} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {Object.entries(facilities).map(([key, label], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex flex-col items-center text-center gap-3 p-5 bg-white border border-slate-200 hover:border-ocean-deep/40 rounded-xs shadow-2xs hover:shadow-md transition-all duration-300"
              >
                <div className="text-ocean-deep">
                  {facilityIcons[key] || <Waves size={20} />}
                </div>
                <span className="text-sm font-semibold text-slate-800 tracking-wide">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
