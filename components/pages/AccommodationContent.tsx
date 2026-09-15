"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
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
import { formatPrice, getWhatsAppUrl, getApiUrl } from "@/lib/utils";
import { useDynamicSettings } from "@/lib/hooks/useDynamicSettings";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData, setStoredData } from "@/lib/storage";

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

const defaultRoomImages = [
  "/img/rooms/1.webp",
  "/img/rooms/2.webp",
];

export default function AccommodationContent({ dict, lang }: Props) {
  const { whatsappNumber } = useDynamicSettings();
  const [dynamicRooms, setDynamicRooms] = useState<any[]>([]);
  const [dynamicFacilities, setDynamicFacilities] = useState<any[]>([]);

  useEffect(() => {
    // 1. Initial load from local persistent storage
    const storedRooms = getStoredData<any[]>(STORAGE_KEYS.ROOMS, []);
    if (Array.isArray(storedRooms) && storedRooms.length > 0) {
      setDynamicRooms(storedRooms);
    }
    const storedFacs = getStoredData<any[]>(STORAGE_KEYS.FACILITIES, []);
    if (Array.isArray(storedFacs) && storedFacs.length > 0) {
      setDynamicFacilities(storedFacs);
    }

    // 2. Real-time sync listener
    const handleSync = () => {
      const updatedRooms = getStoredData<any[]>(STORAGE_KEYS.ROOMS, []);
      if (Array.isArray(updatedRooms) && updatedRooms.length > 0) {
        setDynamicRooms(updatedRooms);
      }
      const updatedFacs = getStoredData<any[]>(STORAGE_KEYS.FACILITIES, []);
      if (Array.isArray(updatedFacs) && updatedFacs.length > 0) {
        setDynamicFacilities(updatedFacs);
      }
    };
    window.addEventListener(DATA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Background fetch from API
    fetch(getApiUrl("/api/kamar.php"))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.status === "success" && Array.isArray(j.data) && j.data.length > 0) {
          setDynamicRooms(j.data);
          setStoredData(STORAGE_KEYS.ROOMS, j.data);
        }
      })
      .catch(() => {});

    fetch(getApiUrl("/api/fasilitas.php"))
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.status === "success" && Array.isArray(j.data) && j.data.length > 0) {
          setDynamicFacilities(j.data);
          setStoredData(STORAGE_KEYS.FACILITIES, j.data);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener(DATA_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const roomsToDisplay = dynamicRooms.length > 0
    ? dynamicRooms.map((r, i) => ({
        name: lang === "en" ? r.title_en : r.title_id,
        description: lang === "en" ? r.description_en : r.description_id,
        capacity: r.capacity,
        price: Number(r.price_per_night),
        image: r.image_url || defaultRoomImages[i % defaultRoomImages.length]
      }))
    : dict.accommodation.rooms.map((r, i) => ({
        ...r,
        image: defaultRoomImages[i % defaultRoomImages.length]
      }));

  const facilitiesToDisplay = dynamicFacilities.length > 0
    ? dynamicFacilities.map((f) => ({
        key: f.icon_name || "wifi",
        label: lang === "en" ? f.title_en : f.title_id
      }))
    : Object.entries(dict.accommodation.facilitiesList).map(([k, label]) => ({
        key: k,
        label
      }));

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
            {roomsToDisplay.map((room, i) => {
              const waMessage =
                lang === "id"
                  ? `Halo, saya ingin memesan ${room.name} di Kasilapa Bay. Mohon informasikan ketersediaannya.`
                  : `Hello, I'd like to book the ${room.name} at Kasilapa Bay. Could you check availability?`;

              return (
                <motion.div
                  key={room.name + i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                  className="group bg-white border border-border hover:border-gold/40 grid grid-cols-1 lg:grid-cols-2 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div
                    className={`aspect-[4/3] lg:aspect-auto relative overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <div
                      className="w-full h-full min-h-[240px] sm:min-h-[320px] group-hover:scale-105 transition-transform duration-700 ease-out"
                      style={{
                        backgroundImage: `url('${room.image}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-gold transition-colors duration-200 mb-3 font-serif">
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
                        href={getWhatsAppUrl(waMessage, whatsappNumber)}
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
            {facilitiesToDisplay.map((fac, i) => (
              <motion.div
                key={fac.label + i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col items-center text-center gap-3 p-5 sm:p-6 bg-white border border-border-light hover:border-gold/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-gold">
                  {facilityIcons[fac.key] || <Waves size={20} />}
                </div>
                <span className="text-sm font-semibold text-foreground tracking-wide">
                  {fac.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
