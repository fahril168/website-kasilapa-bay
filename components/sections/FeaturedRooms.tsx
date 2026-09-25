"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Users,
  BedDouble,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Locale, Dictionary } from "@/lib/i18n";
import { formatPrice, getWhatsAppUrl, getApiUrl } from "@/lib/utils";
import { useDynamicSettings } from "@/lib/hooks/useDynamicSettings";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData, setStoredData } from "@/lib/storage";

type Props = {
  dict: Dictionary;
  lang: Locale;
};

const defaultRoomImages = ["/img/room.webp"];

export default function FeaturedRooms({ dict, lang }: Props) {
  const { roomLayoutSingle, whatsappNumber } = useDynamicSettings();
  const [dynamicRooms, setDynamicRooms] = useState<any[]>([]);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);

  useEffect(() => {
    // 1. Initial load from local persistent storage
    const stored = getStoredData<any[]>(STORAGE_KEYS.ROOMS, []);
    if (Array.isArray(stored) && stored.length > 0) {
      setDynamicRooms(stored);
    }

    // 2. Real-time sync listener
    const handleSync = () => {
      const updated = getStoredData<any[]>(STORAGE_KEYS.ROOMS, []);
      if (Array.isArray(updated) && updated.length > 0) {
        setDynamicRooms(updated);
      }
    };
    window.addEventListener(DATA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Background fetch from API
    fetch(getApiUrl("/api/kamar.php"))
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
          setDynamicRooms(json.data);
          setStoredData(STORAGE_KEYS.ROOMS, json.data);
        }
      })
      .catch(() => {});

    return () => {
      window.removeEventListener(DATA_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Filter only active rooms
  const activeRooms = dynamicRooms.filter(
    (r) => r.is_active !== 0 && r.is_active !== false && r.is_active !== "0"
  );

  const roomsToDisplay = activeRooms.map((r, i) => {
    const imageList =
      Array.isArray(r.images) && r.images.length > 0
        ? r.images.map((img: any) => (typeof img === "string" ? img : img.url)).filter(Boolean)
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
  });

  // Safety clamp if active room index is out of bounds
  useEffect(() => {
    if (activeRoomIndex >= roomsToDisplay.length && roomsToDisplay.length > 0) {
      setActiveRoomIndex(0);
    }
  }, [roomsToDisplay.length, activeRoomIndex]);

  if (roomsToDisplay.length === 0) return null;

  const currentRoom = roomsToDisplay[activeRoomIndex] || roomsToDisplay[0];
  const hasMultipleRooms = roomsToDisplay.length > 1;

  const handlePrevRoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveRoomIndex((prev) => (prev <= 0 ? roomsToDisplay.length - 1 : prev - 1));
  };

  const handleNextRoom = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveRoomIndex((prev) => (prev >= roomsToDisplay.length - 1 ? 0 : prev + 1));
  };

  const currentWaMessage =
    lang === "id"
      ? `Halo, saya ingin memesan ${currentRoom?.name} di Kasilapa Bay. Mohon informasikan ketersediaannya.`
      : `Hello, I'd like to book the ${currentRoom?.name} at Kasilapa Bay. Could you check availability?`;

  /* ─────────────────────────────────────────────────────────────────────────
     OPSI 3: CINEMATIC BANNER (FULL-BLEED / MEMENUHI LAYAR UJUNG KE UJUNG)
  ───────────────────────────────────────────────────────────────────────── */
  if (roomLayoutSingle === "banner") {
    return (
      <section className="bg-dark-warm relative grain-overlay overflow-hidden">
        {/* Section Header — di luar banner, background coklat */}
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-10 lg:pb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <span className="label-accent">{dict.accommodation.title}</span>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight font-serif">
                {dict.accommodation.subtitle}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/${lang}/akomodasi`}
                aria-label={lang === "en" ? "View all accommodations" : "Lihat semua kamar akomodasi"}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors duration-200 tracking-wide uppercase group shrink-0"
              >
                <span>{dict.common.viewAll}</span>
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1.5 transition-transform duration-200"
                />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* FULL-BLEED BANNER — foto tampil dominan, UI minimal */}
        <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[75vh] overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoom.id + "-banner"}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={currentRoom.image || "/img/placeholder.svg"}
                alt={currentRoom.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/img/placeholder.svg";
                }}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient tipis — foto tetap dominan */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

          {/* Konten bawah — minimal & elegan */}
          <div className="absolute inset-x-0 bottom-0 z-10">
            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pb-10 sm:pb-14 lg:pb-16">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoom.id + "-banner-info"}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {/* Baris atas: Nama kamar */}
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-serif mb-3 tracking-tight leading-tight">
                    {currentRoom.name}
                  </h3>

                  {/* Deskripsi singkat */}
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-xl mb-6 line-clamp-2">
                    {currentRoom.description}
                  </p>

                  {/* Baris bawah: Harga + spesifikasi + CTA + navigasi */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    {/* Harga */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-bold text-gold font-sans">
                        {formatPrice(currentRoom.price)}
                      </span>
                      <span className="text-white/50 text-xs font-medium">
                        / {lang === "en" ? "night" : "malam"}
                      </span>
                    </div>

                    {/* Separator */}
                    <div className="hidden sm:block w-px h-5 bg-white/20" />

                    {/* Spesifikasi ringkas tanpa border/background */}
                    <div className="flex items-center gap-4 text-white/60 text-xs sm:text-sm">
                      <span className="flex items-center gap-1.5">
                        <Users size={14} />
                        {currentRoom.capacity} {dict.accommodation.guests}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BedDouble size={14} />
                        {currentRoom.bedType}
                      </span>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* CTA & Navigasi */}
                    <div className="flex items-center gap-3">
                      <a
                        href={getWhatsAppUrl(currentWaMessage, whatsappNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold text-xs sm:text-sm py-3 px-6 flex items-center gap-2 font-semibold tracking-wide uppercase"
                      >
                        <MessageCircle size={15} />
                        <span>{dict.accommodation.bookCta}</span>
                      </a>

                      {/* Navigasi kamar */}
                      {hasMultipleRooms && (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            type="button"
                            onClick={handlePrevRoom}
                            aria-label="Kamar Sebelumnya"
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <span className="text-[11px] font-mono text-white/50 tabular-nums px-1">
                            {activeRoomIndex + 1}/{roomsToDisplay.length}
                          </span>
                          <button
                            type="button"
                            onClick={handleNextRoom}
                            aria-label="Kamar Berikutnya"
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     OPSI 1: SPLIT SHOWCASE & OPSI 2: CENTERED CARD (DALAM CONTAINER MAX-W-7XL)
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <section className="section-padding bg-dark-warm relative grain-overlay">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 lg:mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
        >
          <div>
            <span className="label-accent">{dict.accommodation.title}</span>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.15] tracking-tight font-serif">
              {dict.accommodation.subtitle}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={`/${lang}/akomodasi`}
              aria-label={lang === "en" ? "View all accommodations" : "Lihat semua kamar akomodasi"}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-light transition-colors duration-200 tracking-wide uppercase group shrink-0"
            >
              <span>{dict.common.viewAll}</span>
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1.5 transition-transform duration-200"
              />
            </Link>
          </div>
        </motion.div>

        {/* ── OPSI 1: SPLIT SHOWCASE ── */}
        {(roomLayoutSingle === "split" || (!["centered", "grid", "banner"].includes(roomLayoutSingle))) && (
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#24201c] shadow-2xl group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
                {/* Image Column */}
                <div className="relative lg:col-span-7 min-h-[340px] lg:min-h-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentRoom.id + "-split-img"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={currentRoom.image || "/img/placeholder.svg"}
                        alt={currentRoom.name}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/img/placeholder.svg";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#24201c] pointer-events-none" />
                </div>

                {/* Content Column */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentRoom.id + "-split-content"}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.4 }}
                    >
                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-serif mb-3 leading-tight">
                        {currentRoom.name}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
                        {currentRoom.description}
                      </p>

                      {/* Specs — plain text, no glass boxes */}
                      <div className="flex items-center gap-4 text-white/55 text-xs sm:text-sm mb-6 pb-6 border-b border-white/10">
                        <span className="flex items-center gap-1.5">
                          <Users size={14} />
                          {currentRoom.capacity} {dict.accommodation.guests}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BedDouble size={14} />
                          {currentRoom.bedType}
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  <div>
                    <div className="flex items-baseline gap-1.5 mb-5">
                      <span className="text-3xl lg:text-4xl font-bold text-gold font-sans tracking-tight">
                        {formatPrice(currentRoom.price)}
                      </span>
                      <span className="text-white/50 text-xs font-medium">
                        / {lang === "en" ? "night" : "malam"}
                      </span>
                    </div>

                    {/* CTA & Nav */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <a
                          href={getWhatsAppUrl(currentWaMessage, whatsappNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold text-xs sm:text-sm py-3 px-6 flex items-center gap-2 font-semibold tracking-wide uppercase"
                        >
                          <MessageCircle size={15} />
                          <span>{dict.accommodation.bookCta}</span>
                        </a>
                      </div>

                      {hasMultipleRooms && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={handlePrevRoom}
                            aria-label="Kamar Sebelumnya"
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextRoom}
                            aria-label="Kamar Berikutnya"
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 flex items-center justify-center transition-all cursor-pointer"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── OPSI 2: CENTERED CARD ── */}
        {roomLayoutSingle === "centered" && (
          <div className="relative w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6 }}
              className="relative w-full rounded-2xl overflow-hidden group flex flex-col justify-end min-h-[520px] md:min-h-[580px] lg:min-h-[620px] p-6 sm:p-10 lg:p-14"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoom.id + "-centered-img"}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentRoom.image || "/img/placeholder.svg"}
                    alt={currentRoom.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/placeholder.svg";
                    }}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Gradient — subtle, just enough for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

              {/* Card Content */}
              <div className="relative z-10 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRoom.id + "-centered-info"}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white font-serif mb-3 tracking-tight">
                      {currentRoom.name}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base leading-relaxed line-clamp-2 mb-5 max-w-2xl">
                      {currentRoom.description}
                    </p>

                    <div className="space-y-4">
                      {/* Baris 1: Harga + Spesifikasi */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-bold text-gold font-sans">
                            {formatPrice(currentRoom.price)}
                          </span>
                          <span className="text-white/50 text-xs font-medium">
                            / {lang === "en" ? "night" : "malam"}
                          </span>
                        </div>

                        <div className="hidden sm:block w-px h-5 bg-white/20" />

                        <div className="flex items-center gap-4 text-white/55 text-xs sm:text-sm">
                          <span className="flex items-center gap-1.5">
                            <Users size={14} />
                            {currentRoom.capacity} {dict.accommodation.guests}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <BedDouble size={14} />
                            {currentRoom.bedType}
                          </span>
                        </div>
                      </div>

                      {/* Baris 2: CTA + Navigasi */}
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={getWhatsAppUrl(currentWaMessage, whatsappNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold text-xs sm:text-sm py-3 px-6 flex items-center gap-2 font-semibold tracking-wide uppercase"
                        >
                          <MessageCircle size={15} />
                          <span>{dict.accommodation.bookCta}</span>
                        </a>

                        {hasMultipleRooms && (
                          <div className="flex items-center gap-1.5 ml-auto">
                            <button
                              type="button"
                              onClick={handlePrevRoom}
                              aria-label="Kamar Sebelumnya"
                              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <span className="text-[11px] font-mono text-white/50 tabular-nums px-1">
                              {activeRoomIndex + 1}/{roomsToDisplay.length}
                            </span>
                            <button
                              type="button"
                              onClick={handleNextRoom}
                              aria-label="Kamar Berikutnya"
                              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all cursor-pointer"
                            >
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── OPSI 4: GRID 2 KOLOM ── */}
        {roomLayoutSingle === "grid" && (
          <div className={roomsToDisplay.length === 1 ? "max-w-2xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"}>
            {roomsToDisplay.map((room, i) => {
              const gridWaMessage =
                lang === "id"
                  ? `Halo, saya ingin memesan ${room.name} di Kasilapa Bay. Mohon informasikan ketersediaannya.`
                  : `Hello, I'd like to book the ${room.name} at Kasilapa Bay. Could you check availability?`;
              return (
                <motion.div
                  key={room.name + i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="relative rounded-xl overflow-hidden"
                  style={{ minHeight: "480px" }}
                >
                  <img
                    src={room.image || "/img/placeholder.svg"}
                    alt={room.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/img/placeholder.svg";
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 z-10">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-1.5">
                      {room.name}
                    </h3>

                    {/* Specs inline — no boxes */}
                    <div className="flex items-center gap-3 text-white/50 text-xs mb-4">
                      <span className="flex items-center gap-1">
                        <Users size={13} />
                        {room.capacity} {dict.accommodation.guests}
                      </span>
                      <span className="flex items-center gap-1">
                        <BedDouble size={13} />
                        {room.bedType}
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-bold text-gold font-sans">
                          {formatPrice(room.price)}
                        </span>
                        <span className="text-white/40 text-xs font-medium">
                          / {lang === "en" ? "night" : "malam"}
                        </span>
                      </div>
                      <a
                        href={getWhatsAppUrl(gridWaMessage, whatsappNumber)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold text-xs py-2.5 px-5 flex items-center gap-2 font-semibold tracking-wide uppercase"
                      >
                        <MessageCircle size={14} />
                        <span>{dict.accommodation.bookCta}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
