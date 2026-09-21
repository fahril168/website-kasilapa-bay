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
  ChevronLeft,
  ChevronRight,
  Camera,
  X,
  BedDouble,
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

type RoomItem = {
  id: number;
  name: string;
  description: string;
  capacity: number;
  bedType: string;
  price: number;
  image: string;
  images: string[];
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
  "/img/room.webp",
];

/* ── Interactive Room Card with Built-in Image Slider ── */
function RoomCardWithSlider({
  room,
  index,
  lang,
  dict,
  whatsappNumber,
  onOpenLightbox,
}: {
  room: RoomItem;
  index: number;
  lang: Locale;
  dict: Dictionary;
  whatsappNumber: string;
  onOpenLightbox: (room: RoomItem, imgIdx: number) => void;
}) {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const images = room.images && room.images.length > 0 ? room.images : [room.image];
  const currentImage = images[activeImgIdx] || images[0] || "/img/room.webp";

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  const waMessage =
    lang === "id"
      ? `Halo, saya ingin memesan ${room.name} di Kasilapa Bay. Mohon informasikan ketersediaannya.`
      : `Hello, I'd like to book the ${room.name} at Kasilapa Bay. Could you check availability?`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className="group bg-white border border-border hover:border-gold/40 grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      {/* Slider / Image Column */}
      <div
        className={`lg:col-span-7 relative overflow-hidden bg-slate-900 ${
          index % 2 === 1 ? "lg:order-2" : ""
        }`}
      >
        <div
          onClick={() => onOpenLightbox(room, activeImgIdx)}
          className="relative w-full h-[280px] sm:h-[360px] lg:h-full min-h-[280px] lg:min-h-[420px] cursor-pointer overflow-hidden group/img"
        >
          {/* Active Image Background with Smooth Transition */}
          <div
            key={currentImage}
            className="w-full h-full bg-cover bg-center transition-all duration-500 ease-out group-hover/img:scale-105"
            style={{ backgroundImage: `url('${currentImage}')` }}
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />



          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md hover:scale-110 opacity-90 sm:opacity-0 group-hover/img:opacity-100 cursor-pointer border border-white/10"
                title="Foto Sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md hover:scale-110 opacity-90 sm:opacity-0 group-hover/img:opacity-100 cursor-pointer border border-white/10"
                title="Foto Berikutnya"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Bottom Controls: Dots & Quick Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
              {/* Dots */}
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {images.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIdx(dotIdx);
                    }}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activeImgIdx === dotIdx
                        ? "bg-gold w-5 h-1.5"
                        : "bg-white/60 hover:bg-white w-1.5 h-1.5"
                    }`}
                    title={`Lihat foto ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* Quick Thumbnail Strip */}
              <div className="hidden sm:flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
                {images.slice(0, 4).map((imgUrl, thumbIdx) => (
                  <button
                    key={thumbIdx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImgIdx(thumbIdx);
                    }}
                    className={`w-9 h-7 rounded-lg overflow-hidden transition-all cursor-pointer border ${
                      activeImgIdx === thumbIdx
                        ? "border-gold ring-2 ring-gold/40 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
                {images.length > 4 && (
                  <button
                    type="button"
                    onClick={() => onOpenLightbox(room, 4)}
                    className="w-9 h-7 rounded-lg bg-black/60 text-white text-[10px] font-bold flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    +{images.length - 4}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Column */}
      <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-gold transition-colors duration-200 font-serif">
              {room.name}
            </h3>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => onOpenLightbox(room, 0)}
                className="text-xs font-semibold text-gold hover:text-gold-light transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Camera size={13} />
                <span>
                  {images.length} {lang === "en" ? "Photos" : "Foto"}
                </span>
              </button>
            )}
          </div>

          <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 font-normal">
            {room.description}
          </p>

          {/* Specs: Capacity & Bed */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted font-medium mb-6 pb-6 border-b border-border-light">
            <span className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-border-light">
              <Users size={16} className="text-gold" />
              <span>
                {room.capacity} {dict.accommodation.guests}
              </span>
            </span>
            <span className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border border-border-light">
              <BedDouble size={16} className="text-gold" />
              <span>{room.bedType}</span>
            </span>
          </div>
        </div>

        {/* Price & Booking CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between flex-wrap gap-4 pt-2">
          <div>
            <span className="text-xs text-muted block mb-0.5">
              {lang === "en" ? "Starts from" : "Mulai dari"}
            </span>
            <span className="text-2xl sm:text-3xl font-bold text-foreground font-sans tracking-tight">
              {formatPrice(room.price)}
            </span>
            <span className="text-muted text-xs sm:text-sm font-medium ml-1.5">
              {dict.accommodation.perNight}
            </span>
          </div>
          <a
            href={getWhatsAppUrl(waMessage, whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-xs w-full sm:w-auto text-center"
          >
            <span>{dict.accommodation.bookCta}</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function AccommodationContent({ dict, lang }: Props) {
  const { whatsappNumber } = useDynamicSettings();
  const [dynamicRooms, setDynamicRooms] = useState<any[]>([]);
  const [dynamicFacilities, setDynamicFacilities] = useState<any[]>([]);
  const [lightbox, setLightbox] = useState<{ room: RoomItem; imgIdx: number } | null>(null);

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

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
      } else if (e.key === "ArrowLeft") {
        setLightbox((prev) =>
          prev
            ? {
                ...prev,
                imgIdx: prev.imgIdx <= 0 ? prev.room.images.length - 1 : prev.imgIdx - 1,
              }
            : null
        );
      } else if (e.key === "ArrowRight") {
        setLightbox((prev) =>
          prev
            ? {
                ...prev,
                imgIdx: prev.imgIdx >= prev.room.images.length - 1 ? 0 : prev.imgIdx + 1,
              }
            : null
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox]);

  const roomsToDisplay: RoomItem[] = dynamicRooms.length > 0
    ? dynamicRooms.map((r, i) => {
        const imageList = Array.isArray(r.images) && r.images.length > 0
          ? r.images.map((img: any) => typeof img === "string" ? img : img.url).filter(Boolean)
          : [r.image_url || defaultRoomImages[i % defaultRoomImages.length]];

        return {
          id: r.id || i + 1,
          name: lang === "en" ? r.title_en : r.title_id,
          description: lang === "en" ? r.description_en : r.description_id,
          capacity: r.capacity || 2,
          bedType: r.bed_type || (lang === "en" ? "King Bed" : "Tempat Tidur King"),
          price: Number(r.price_per_night),
          image: imageList[0] || r.image_url || defaultRoomImages[i % defaultRoomImages.length],
          images: imageList,
        };
      })
    : dict.accommodation.rooms.map((r, i) => ({
        id: i + 1,
        ...r,
        bedType: "King Bed",
        image: defaultRoomImages[i % defaultRoomImages.length],
        images: [defaultRoomImages[i % defaultRoomImages.length]],
      }));

  const facilitiesToDisplay = dynamicFacilities.length > 0
    ? dynamicFacilities.map((f) => ({
        key: f.icon_name || "wifi",
        label: lang === "en" ? f.title_en : f.title_id,
      }))
    : Object.entries(dict.accommodation.facilitiesList).map(([k, label]) => ({
        key: k,
        label,
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

          {/* Rooms List */}
          <div className="space-y-6 sm:space-y-8">
            {roomsToDisplay.map((room, i) => (
              <RoomCardWithSlider
                key={room.id || room.name + i}
                room={room}
                index={i}
                lang={lang}
                dict={dict}
                whatsappNumber={whatsappNumber}
                onOpenLightbox={(targetRoom, imgIdx) => {
                  setLightbox({ room: targetRoom, imgIdx });
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──────────── FULLSCREEN ROOM LIGHTBOX MODAL ──────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between text-white pb-3 border-b border-white/10 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-base sm:text-xl font-bold font-serif text-white flex items-center gap-2">
                <span>{lightbox.room.name}</span>
                <span className="text-xs font-normal text-gold bg-gold/10 border border-gold/30 px-2 py-0.5 rounded-full">
                  Kasilapa Bay
                </span>
              </h4>
              <p className="text-xs text-white/60 mt-0.5">
                {lang === "en" ? "Photo" : "Foto"} {lightbox.imgIdx + 1} {lang === "en" ? "of" : "dari"} {lightbox.room.images.length}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={getWhatsAppUrl(
                  lang === "id"
                    ? `Halo, saya tertarik dengan ${lightbox.room.name} di Kasilapa Bay setelah melihat galerinya. Apakah kamar ini tersedia?`
                    : `Hello, I am interested in ${lightbox.room.name} at Kasilapa Bay. Is it available?`,
                  whatsappNumber
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 btn-gold text-xs py-2 px-4"
              >
                <span>{dict.accommodation.bookCta}</span>
                <ArrowRight size={14} />
              </a>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Tutup (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Center: Large Image with Nav Buttons */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.room.images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightbox((prev) =>
                    prev
                      ? {
                          ...prev,
                          imgIdx:
                            prev.imgIdx <= 0
                              ? prev.room.images.length - 1
                              : prev.imgIdx - 1,
                        }
                      : null
                  )
                }
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg border border-white/20 cursor-pointer"
                title="Sebelumnya (←)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img
              key={lightbox.room.images[lightbox.imgIdx]}
              src={lightbox.room.images[lightbox.imgIdx]}
              alt={lightbox.room.name}
              className="max-h-[65vh] sm:max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 select-none"
            />

            {lightbox.room.images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setLightbox((prev) =>
                    prev
                      ? {
                          ...prev,
                          imgIdx:
                            prev.imgIdx >= prev.room.images.length - 1
                              ? 0
                              : prev.imgIdx + 1,
                        }
                      : null
                  )
                }
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 shadow-lg border border-white/20 cursor-pointer"
                title="Berikutnya (→)"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Filmstrip */}
          {lightbox.room.images.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 pt-2 overflow-x-auto py-1 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.room.images.map((imgUrl, thumbIdx) => (
                <button
                  key={thumbIdx}
                  type="button"
                  onClick={() =>
                    setLightbox((prev) => (prev ? { ...prev, imgIdx: thumbIdx } : null))
                  }
                  className={`w-14 sm:w-16 h-10 sm:h-12 rounded-lg overflow-hidden transition-all cursor-pointer border-2 shrink-0 ${
                    lightbox.imgIdx === thumbIdx
                      ? "border-gold ring-2 ring-gold/50 scale-105"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
