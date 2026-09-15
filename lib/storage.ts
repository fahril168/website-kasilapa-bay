// ==============================================================================
// Kasilapa Bay - Unified Data & Storage Synchronization
// Provides seamless persistence across localStorage and live PHP/MySQL API
// ==============================================================================

export const STORAGE_KEYS = {
  ROOMS: "kasilapa_db_rooms",
  DESTINATIONS: "kasilapa_db_destinations",
  GALLERY: "kasilapa_db_gallery",
  REVIEWS: "kasilapa_db_reviews",
  FACILITIES: "kasilapa_db_facilities",
  SETTINGS: "kasilapa_db_settings",
} as const;

export const DATA_SYNC_EVENT = "kasilapa_data_synced";

export function emitDataSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DATA_SYNC_EVENT));
  }
}

export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    return (parsed !== null && parsed !== undefined) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredData<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    emitDataSync();
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}
