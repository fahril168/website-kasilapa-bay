"use client";

import { useState, useEffect } from "react";
import { WHATSAPP_NUMBER, getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, DATA_SYNC_EVENT, getStoredData, setStoredData } from "@/lib/storage";

export type DynamicContacts = {
  phone_primary: string;
  phone_secondary?: string;
  email: string;
  address: string;
  instagram_url: string;
  instagram_username?: string;
  instagram_active?: number | boolean;
  facebook_url: string;
  facebook_active?: number | boolean;
  tiktok_url: string;
  tiktok_active?: number | boolean;
};

export type DynamicSettings = {
  about_headline_id: string;
  about_description_id: string;
  about_headline_en: string;
  about_description_en: string;
  about_images?: string[];
  room_layout_single?: "split" | "centered" | "banner" | "grid";
};

export function useDynamicContacts() {
  const [contacts, setContacts] = useState<DynamicContacts | null>(null);

  useEffect(() => {
    // 1. Initial load from local persistent storage
    const stored = getStoredData<DynamicContacts | null>(STORAGE_KEYS.CONTACTS, null);
    if (stored) {
      setContacts(stored);
    }

    // 2. Real-time sync listener
    const handleSync = () => {
      const updated = getStoredData<DynamicContacts | null>(STORAGE_KEYS.CONTACTS, null);
      if (updated) {
        setContacts(updated);
      }
    };
    window.addEventListener(DATA_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    // 3. Background fetch from dedicated contacts API
    fetch(getApiUrl("/api/kontak.php"))
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.status === "success" && json?.data) {
          setContacts(json.data);
          setStoredData(STORAGE_KEYS.CONTACTS, json.data);
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

  const phonePrimary = contacts?.phone_primary || WHATSAPP_NUMBER;
  const phoneSecondary = contacts?.phone_secondary || "";

  const instagramActive = contacts?.instagram_active !== undefined 
    ? (Number(contacts.instagram_active) === 1 || contacts.instagram_active === true) 
    : true;
  const facebookActive = contacts?.facebook_active !== undefined 
    ? (Number(contacts.facebook_active) === 1 || contacts.facebook_active === true) 
    : false;
  const tiktokActive = contacts?.tiktok_active !== undefined 
    ? (Number(contacts.tiktok_active) === 1 || contacts.tiktok_active === true) 
    : false;

  return {
    contacts,
    phonePrimary,
    phoneSecondary,
    whatsappNumber: phonePrimary,
    whatsappNumberSecondary: phoneSecondary,
    email: contacts?.email || "hello@kasilapahotel.com",
    address: contacts?.address || "Desa Kasilapa, Pulau Tomia, Wakatobi, Indonesia",
    instagramUrl: contacts?.instagram_url || "https://instagram.com/kasilapahoteltomia",
    instagramUsername: contacts?.instagram_username || "@kasilapahoteltomia",
    instagramActive,
    facebookUrl: contacts?.facebook_url || "",
    facebookActive,
    tiktokUrl: contacts?.tiktok_url || "",
    tiktokActive,
  };
}

export function useDynamicSettings() {
  const [settings, setSettings] = useState<DynamicSettings | null>(null);
  const contactsHook = useDynamicContacts();

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

    // 3. Background fetch from dedicated settings API
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
    roomLayoutSingle: settings?.room_layout_single || "split",
    ...contactsHook,
  };
}
