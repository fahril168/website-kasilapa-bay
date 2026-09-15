"use client";

import { useState, useEffect } from "react";
import { WHATSAPP_NUMBER, getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData, setStoredData } from "@/lib/storage";

export type DynamicSettings = {
  about_headline_id: string;
  about_description_id: string;
  about_headline_en: string;
  about_description_en: string;
  whatsapp_number: string;
  email: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
};

export function useDynamicSettings() {
  const [settings, setSettings] = useState<DynamicSettings | null>(null);

  useEffect(() => {
    // 1. Initial load from local persistent storage
    const stored = getStoredData<DynamicSettings | null>(STORAGE_KEYS.SETTINGS, null);
    if (stored) {
      setSettings(stored);
    }

    // 2. Real-time sync listener
    const handleSync = () => {
      const updated = getStoredData<DynamicSettings | null>(STORAGE_KEYS.SETTINGS, null);
      if (updated) {
        setSettings(updated);
      }
    };
    window.addEventListener(DATA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Background fetch from API
    fetch(getApiUrl("/api/pengaturan.php"))
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.status === "success" && json?.data) {
          setSettings(json.data);
          setStoredData(STORAGE_KEYS.SETTINGS, json.data);
        }
      })
      .catch(() => {
        // Fallback silently if offline
      });

    return () => {
      window.removeEventListener(DATA_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  return {
    settings,
    whatsappNumber: settings?.whatsapp_number || WHATSAPP_NUMBER,
    email: settings?.email || "hello@kasilapabay.com",
    address: settings?.address || "Desa Kasilapa, Pulau Tomia, Wakatobi, Indonesia",
    instagramUrl: settings?.instagram_url || "https://instagram.com/kasilapabay",
    facebookUrl: settings?.facebook_url || "https://facebook.com/kasilapabay",
    tiktokUrl: settings?.tiktok_url || "https://tiktok.com/@kasilapabay",
  };
}
