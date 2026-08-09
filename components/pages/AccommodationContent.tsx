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

const roomImages = [
  "/img/rooms/6.webp",
  "/img/rooms/12.webp",
  "/img/rooms/3.webp",
];

export default function AccommodationContent({ dict, lang }: Props) {
  const rooms = dict.accommodation.rooms;
  const facilities = dict.accommodation.facilitiesList;

  return (
    <>
      {/* Page Header */}
      <section className="pt-16 section-padding bg-background">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kasilapa Bay"
            title={dict.accommodation.title}
            subtitle={dict.accommodation.subtitle}
          />

          {/* Rooms */}
          <div className="space-y-6 sm:space-y-8">
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
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                  className="group bg-white border border-border hover:border-gold/40 grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div
                    className={`aspect-[4/3] lg:aspect-auto relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""
                      }`}
                  >
                    <div
                      className="w-full h-full min-h-[240px] sm:min-h-[320px] group-hover:scale-105 transition-transform duration-700 ease-out"
                      style={{
                        backgroundImage: `url('${roomImages[i] || roomImages[0]}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-accent transition-colors duration-200 mb-3 font-serif">
                      {room.name}
                    </h3>
                    <p className="text-muted text-base leading-relaxed mb-6 font-normal">
                      {room.description}
                    </p>

                    {/* Specs */}
                    <div className="flex flex-wrap gap-6 text-sm text-muted font-medium mb-8 pb-6 border-b border-border-light">
                      <span className="flex items-center gap-2">
                        <Users size={16} className="text-gold" />
                        {room.capacity} {dict.accommodation.guests}
                      </span>
                      <span className="flex items-center gap-2">
                        <BedDouble size={16} className="text-gold" />
                        {room.bed}
                      </span>
                      <span className="flex items-center gap-2">
                        <Eye size={16} className="text-gold" />
                        {room.view}
                      </span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between flex-wrap gap-4">
                      <div>
                        <span className="text-2xl font-bold text-foreground font-sans">
                          {formatPrice(room.price)}
                        </span>
                        <span className="text-muted text-sm font-medium ml-1.5">
                          {dict.accommodation.perNight}
                        </span>
                      </div>
                      <a
                        href={getWhatsAppUrl(waMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold text-xs"
                      >
                        <span>{dict.accommodation.bookCta}</span>
                        <ArrowRight size={15} />
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
      <section className="section-padding bg-surface relative grain-overlay">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader label={dict.accommodation.title} title={dict.accommodation.facilities} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {Object.entries(facilities).map(([key, label], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col items-center text-center gap-3 p-5 sm:p-6 bg-white border border-border-light hover:border-gold/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-gold">
                  {facilityIcons[key] || <Waves size={20} />}
                </div>
                <span className="text-sm font-semibold text-foreground tracking-wide">
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
