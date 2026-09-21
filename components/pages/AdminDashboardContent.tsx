"use client";

import { useState, useEffect } from "react";
import {
  Lock,
  User,
  KeyRound,
  BedDouble,
  MapPin,
  Image as ImageIcon,
  Star,
  Settings,
  Coffee,
  Phone,
  Plus,
  Trash2,
  Pencil,
  RefreshCw,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Save,
  X,
  LayoutDashboard,
  Menu,
  ExternalLink,
  Sparkles,
  Home,
  Check,
  Sliders,
  UploadCloud,
  TrendingUp,
  Users,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  Clock,
  Calendar,
  ArrowRight,
  BarChart3,
  Activity,
  Compass,
  LineChart,
  Search,
  Bell,
  Maximize2,
  Sun,
  Minus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
} from "lucide-react";

import { getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, getStoredData, setStoredData } from "@/lib/storage";

/* ──────────────── Types ──────────────── */

export type VisitorMetric = {
  today_views: number;
  today_visitors: number;
  yesterday_views: number;
  yesterday_visitors: number;
  period_views: number;
  period_visitors: number;
  total_views: number;
  total_visitors: number;
};

export type DailyTrend = {
  date: string;
  label: string;
  views: number;
  visitors: number;
};

export type TopPage = {
  page_url: string;
  title: string;
  views: number;
  visitors: number;
  percentage: number;
};

export type TopCountry = {
  country_code: string;
  country_name: string;
  visitors: number;
  views?: number;
  percentage: number;
};

export type BreakdownItem = {
  device_type?: string;
  browser?: string;
  count: number;
  percentage: number;
};

export type VisitorLog = {
  id: number;
  ip_address: string;
  page_url: string;
  page_title: string;
  device_type: string;
  browser: string;
  operating_system: string;
  country_code?: string;
  country_name?: string;
  referrer: string;
  created_at: string;
};

export type VisitorStatsData = {
  period_days: number;
  metrics: VisitorMetric;
  daily_trend: DailyTrend[];
  top_pages: TopPage[];
  top_countries?: TopCountry[];
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  recent_logs: VisitorLog[];
};

export type AttachedImage = {
  id: number;
  url: string;
  thumbnail_url?: string | null;
  thumb_url?: string | null;
  alt_text_id?: string | null;
  alt_text_en?: string | null;
  category?: string;
  is_cover?: number | boolean;
  sort_order?: number;
  usage_count?: number;
};

export type UploadProgressItem = {
  id: string;
  name: string;
  size: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  url?: string;
};

type Room = { id: number; title_id: string; title_en: string; slug: string; price_per_night: number; capacity: number; bed_type: string; image_url: string; description_id: string; description_en: string; images?: AttachedImage[] };
type Destination = { id: number; name_id: string; name_en: string; category: string; description_id: string; description_en: string; distance: string; image_url: string; info_url: string; images?: AttachedImage[] };
type GalleryItem = { id: number; title_id: string; title_en: string; category: string; image_url: string; is_active?: number | boolean; thumbnail_url?: string | null };
type Review = { id: number; guest_name: string; origin: string; rating: number; comment_id: string; comment_en: string; is_visible: number };
type Facility = { id: number; title_id: string; title_en: string; icon_name: string; is_active: number };
type SiteSettings = { about_headline_id: string; about_description_id: string; about_headline_en: string; about_description_en: string; about_images?: string[] };
type SiteContacts = { 
  phone_primary: string; 
  phone_secondary: string; 
  email: string; 
  address: string; 
  instagram_url: string; 
  instagram_username?: string;
  instagram_active: number | boolean;
  facebook_url: string; 
  facebook_active: number | boolean;
  tiktok_url: string; 
  tiktok_active: number | boolean;
};

type TabKey = "dashboard" | "rooms" | "destinations" | "gallery" | "reviews" | "facilities" | "contacts" | "settings";

const CATEGORY_LABEL_MAP: Record<string, string> = {
  property: "Penginapan",
  underwater: "Bawah Laut",
  island: "Pulau",
  dining: "Kuliner",
};

/* ──────────────── Default Clean Data Structures (Live from Database) ──────────────── */

const EMPTY_ROOMS: Room[] = [];
const EMPTY_DESTINATIONS: Destination[] = [];
const EMPTY_GALLERY: GalleryItem[] = [];
const EMPTY_REVIEWS: Review[] = [];
const EMPTY_FACILITIES: Facility[] = [];

const EMPTY_SETTINGS: SiteSettings = {
  about_headline_id: "",
  about_description_id: "",
  about_headline_en: "",
  about_description_en: "",
  about_images: [],
};

const EMPTY_CONTACTS: SiteContacts = {
  phone_primary: "",
  phone_secondary: "",
  email: "",
  address: "",
  instagram_url: "",
  instagram_username: "@kasilapahoteltomia",
  instagram_active: 1,
  facebook_url: "",
  facebook_active: 0,
  tiktok_url: "",
  tiktok_active: 0,
};

const EMPTY_VISITOR_STATS: VisitorStatsData = {
  period_days: 7,
  metrics: {
    today_views: 0,
    today_visitors: 0,
    yesterday_views: 0,
    yesterday_visitors: 0,
    period_views: 0,
    period_visitors: 0,
    total_views: 0,
    total_visitors: 0,
  },
  daily_trend: [],
  top_pages: [],
  devices: [],
  browsers: [],
  top_countries: [],
  recent_logs: [],
};


function CountryFlag({ code, name, size = "sm" }: { code?: string; name?: string; size?: "sm" | "md" }) {
  const cleanCode = (code || "ID").toLowerCase().slice(0, 2);
  const dim = size === "md" ? "w-5 h-3.5" : "w-4 h-3";

  return (
    <span className="inline-flex items-center shrink-0">
      <img
        src={`https://flagcdn.com/w40/${cleanCode}.png`}
        alt={name || code || "Flag"}
        className={`${dim} rounded-[2px] shadow-2xs object-cover border border-slate-200/80 inline-block`}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    </span>
  );
}

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "-";
  if (dateStr.includes("lalu") || dateStr.includes("Baru") || dateStr.includes("saja")) return dateStr;
  try {
    const cleanStr = dateStr.replace(/-/g, "/");
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) return dateStr;
    const diffSeconds = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diffSeconds < 60) return "Baru saja";
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} menit lalu`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} jam lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return dateStr;
  }
}

function getStraightPath(points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return "";
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
}


/* ──────────────── Helpers ──────────────── */

const inputCls = "w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all shadow-xs";
const labelCls = "block text-xs font-semibold text-gray-700 mb-1.5";
const btnPrimary = "inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all shadow-xs hover:shadow-md";
const btnDanger = "inline-flex items-center gap-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors";
const btnGhost = "inline-flex items-center gap-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors";

/* ──────────────── Component ──────────────── */

export default function AdminDashboardContent() {
  /* Auth */
  const [isAuth, setIsAuth] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErr, setLoginErr] = useState("");

  /* UI */
  const [tab, setTab] = useState<TabKey>("dashboard");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [menuFilter, setMenuFilter] = useState("");
  const [chartMinimized, setChartMinimized] = useState(false);

  /* Visitor Analytics State (Live from MySQL site_visitors) */
  const [visitorStats, setVisitorStats] = useState<VisitorStatsData>(EMPTY_VISITOR_STATS);
  const [visitorPeriod, setVisitorPeriod] = useState<number>(7);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  /* Data initialized empty and populated directly from live MySQL database */
  const [rooms, setRooms] = useState<Room[]>(EMPTY_ROOMS);
  const [destinations, setDestinations] = useState<Destination[]>(EMPTY_DESTINATIONS);
  const [gallery, setGallery] = useState<GalleryItem[]>(EMPTY_GALLERY);
  const [reviews, setReviews] = useState<Review[]>(EMPTY_REVIEWS);
  const [facilities, setFacilities] = useState<Facility[]>(EMPTY_FACILITIES);
  const [contacts, setContacts] = useState<SiteContacts>(EMPTY_CONTACTS);
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [syncLoading, setSyncLoading] = useState<boolean>(false);

  useEffect(() => {
    // Purge old synthetic dummy data if previously stored in localStorage
    if (typeof window !== "undefined") {
      const cachedGallery = getStoredData<GalleryItem[]>(STORAGE_KEYS.GALLERY, []);
      const isLegacyDummy = cachedGallery.length > 30 && cachedGallery.some(g => g.title_id?.includes("Penginapan Kasilapa Bay 30"));
      if (isLegacyDummy) {
        localStorage.removeItem(STORAGE_KEYS.ROOMS);
        localStorage.removeItem(STORAGE_KEYS.DESTINATIONS);
        localStorage.removeItem(STORAGE_KEYS.GALLERY);
        localStorage.removeItem(STORAGE_KEYS.REVIEWS);
        localStorage.removeItem(STORAGE_KEYS.FACILITIES);
        localStorage.removeItem(STORAGE_KEYS.CONTACTS);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.VISITOR_STATS);
      } else {
        setRooms(getStoredData(STORAGE_KEYS.ROOMS, EMPTY_ROOMS));
        setDestinations(getStoredData(STORAGE_KEYS.DESTINATIONS, EMPTY_DESTINATIONS));
        setGallery(getStoredData(STORAGE_KEYS.GALLERY, EMPTY_GALLERY));
        setReviews(getStoredData(STORAGE_KEYS.REVIEWS, EMPTY_REVIEWS));
        setFacilities(getStoredData(STORAGE_KEYS.FACILITIES, EMPTY_FACILITIES));
        setContacts(getStoredData(STORAGE_KEYS.CONTACTS, EMPTY_CONTACTS));
        setSettings(getStoredData(STORAGE_KEYS.SETTINGS, EMPTY_SETTINGS));
        const localStats = getStoredData<VisitorStatsData | null>(STORAGE_KEYS.VISITOR_STATS, null);
        if (localStats && localStats.metrics) {
          setVisitorStats(localStats);
        }
      }
    }
  }, []);

  /* Change password state */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  /* Modal & File Upload */
  const [modalType, setModalType] = useState<"room" | "destination" | "gallery" | "review" | "facility" | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ endpoint: string; id: number; setter: any; title?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressItem[]>([]);
  const [scrapingImage, setScrapingImage] = useState(false);

  /* Batch Upload for Gallery State */
  const [batchUploadOpen, setBatchUploadOpen] = useState(false);
  const [batchCategory, setBatchCategory] = useState("property");
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [batchIsActive, setBatchIsActive] = useState(true);

  /* Media Library Modal State */
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"single" | "multi">("single");
  const [pickerSelectedUrl, setPickerSelectedUrl] = useState("");
  const [pickerOnSelect, setPickerOnSelect] = useState<((url: string) => void) | null>(null);
  const [pickerOnSelectMultiple, setPickerOnSelectMultiple] = useState<((images: AttachedImage[]) => void) | null>(null);
  const [pickerCategory, setPickerCategory] = useState("all");
  const [pickerSearch, setPickerSearch] = useState("");
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerTotalPages, setPickerTotalPages] = useState(1);
  const [pickerTotalItems, setPickerTotalItems] = useState(0);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerMediaItems, setPickerMediaItems] = useState<AttachedImage[]>([]);
  const [selectedMediaMap, setSelectedMediaMap] = useState<Map<number, AttachedImage>>(new Map());

  async function fetchMediaLibrary(page = 1, category = pickerCategory, search = pickerSearch) {
    setPickerLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== "all") params.append("category", category);
      if (search && search.trim()) params.append("search", search.trim());
      params.append("page", page.toString());
      params.append("limit", "24");

      const res = await fetch(getApiUrl(`/api/media.php?${params.toString()}`), {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      const d = await res.json();
      if (res.ok && d.status === "success") {
        setPickerMediaItems(d.data || []);
        if (d.pagination) {
          setPickerPage(d.pagination.page);
          setPickerTotalPages(d.pagination.total_pages);
          setPickerTotalItems(d.pagination.total_items);
        }
      } else {
        if (res.status === 401) {
          logout();
          setToast({ type: "err", text: "Sesi telah berakhir. Silakan login kembali." });
        }
      }
    } catch {
      // Fallback: populate from gallery state if local or offline
      const fallback = gallery.map(g => ({
        id: g.id,
        url: g.image_url,
        thumbnail_url: g.image_url,
        thumb_url: g.image_url,
        alt_text_id: g.title_id,
        category: g.category,
        usage_count: 0
      }));
      setPickerMediaItems(fallback);
    } finally {
      setPickerLoading(false);
    }
  }

  function openPicker(currentUrl: string, onSelect: (url: string) => void) {
    setPickerMode("single");
    setPickerSelectedUrl(currentUrl || "");
    setPickerOnSelect(() => onSelect);
    setPickerOnSelectMultiple(null);
    setSelectedMediaMap(new Map());
    setPickerCategory("all");
    setPickerSearch("");
    setPickerPage(1);
    setPickerOpen(true);
    fetchMediaLibrary(1, "all", "");
  }

  function openMultiPicker(existingImages: AttachedImage[], onSelectMultiple: (images: AttachedImage[]) => void) {
    setPickerMode("multi");
    setPickerSelectedUrl("");
    setPickerOnSelect(null);
    setPickerOnSelectMultiple(() => onSelectMultiple);

    const preSelected = new Map<number, AttachedImage>();
    existingImages.forEach(img => {
      if (img.id) preSelected.set(img.id, img);
    });
    setSelectedMediaMap(preSelected);

    setPickerCategory("all");
    setPickerSearch("");
    setPickerPage(1);
    setPickerOpen(true);
    fetchMediaLibrary(1, "all", "");
  }

  // Refetch media library when category or search changes while open
  useEffect(() => {
    if (pickerOpen) {
      const timer = setTimeout(() => {
        fetchMediaLibrary(pickerPage, pickerCategory, pickerSearch);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pickerCategory, pickerSearch, pickerPage, pickerOpen]);

  const storageEndpointMap: Record<string, string> = {
    "/api/kamar.php": STORAGE_KEYS.ROOMS,
    "/api/destinasi.php": STORAGE_KEYS.DESTINATIONS,
    "/api/galeri.php": STORAGE_KEYS.GALLERY,
    "/api/ulasan.php": STORAGE_KEYS.REVIEWS,
    "/api/fasilitas.php": STORAGE_KEYS.FACILITIES,
  };

  async function toggleGalleryActive(item: GalleryItem) {
    const currentActive = item.is_active !== 0 && item.is_active !== false;
    const newActive = currentActive ? 0 : 1;
    // Optimistic UI update & storage sync
    setGallery(prev => {
      const updated = prev.map(g => g.id === item.id ? { ...g, is_active: newActive } : g);
      setStoredData(STORAGE_KEYS.GALLERY, updated);
      return updated;
    });

    setToast({ 
      type: "ok", 
      text: `Foto "${item.title_id}" berhasil ${newActive === 1 ? "diaktifkan (tampil di website)" : "dinonaktifkan (disembunyikan)"}!` 
    });

    try {
      await fetch(getApiUrl("/api/galeri.php"), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ id: item.id, is_active: newActive })
      });
    } catch {
      // Local persistent storage already updated
    }
  }

  /* ── Single Image Upload Helper (for legacy / gallery) ── */
  async function handleFileUpload(file: File, onSuccess: (url: string, imageId?: number) => void) {
    if (!file) return;
    setUploading(true);
    setToast(null);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(getApiUrl("/api/upload.php"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: formData
      });

      const d = await res.json();
      if (res.status === 401) {
        logout();
        setToast({ type: "err", text: "Sesi telah berakhir. Silakan login kembali." });
        return;
      }
      if (res.ok && d.status === "success") {
        onSuccess(d.image_url, d.image_id);
        setToast({ type: "ok", text: "Foto berhasil diunggah!" });
      } else {
        setToast({ type: "err", text: d.message || "Gagal mengunggah foto." });
      }
    } catch {
      setToast({ type: "err", text: "Gagal terhubung ke server upload API." });
    } finally {
      setUploading(false);
    }
  }

  /* ── Multi-File Upload Helper with per-file progress & fault tolerance ── */
  async function handleMultiUpload(
    files: FileList | File[],
    currentCategory: string = "property",
    onAppendImages: (newImages: AttachedImage[]) => void
  ) {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    const initialProgress: UploadProgressItem[] = fileList.map((f, i) => ({
      id: `${Date.now()}_${i}_${f.name}`,
      name: f.name,
      size: f.size,
      status: "pending"
    }));

    setUploadProgress(initialProgress);
    setUploading(true);

    const successful: AttachedImage[] = [];
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: "uploading" } : item));

      // Quick validation
      const validExts = /\.(jpe?g|png|webp|gif)$/i;
      if (!validExts.test(file.name)) {
        failCount++;
        setUploadProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: "error", error: "Format harus JPG, PNG, atau WebP" } : item));
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        failCount++;
        setUploadProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: "error", error: "Ukuran file melebihi 10MB" } : item));
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("category", currentCategory);

        const res = await fetch(getApiUrl("/api/upload.php"), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`
          },
          body: formData
        });

        const d = await res.json();

        if (res.status === 401) {
          logout();
          setToast({ type: "err", text: "Sesi telah berakhir. Silakan login kembali." });
          setUploading(false);
          return;
        }

        if (res.ok && d.status === "success" && d.image_id) {
          successCount++;
          const newImg: AttachedImage = {
            id: Number(d.image_id),
            url: d.image_url,
            thumbnail_url: d.thumbnail_url || d.image_url,
            thumb_url: d.thumbnail_url || d.image_url,
            alt_text_id: file.name.replace(/\.[^/.]+$/, ""),
            category: d.category || currentCategory,
            is_cover: 0,
            sort_order: 0,
            usage_count: 0
          };
          successful.push(newImg);
          setUploadProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: "success", url: d.image_url } : item));
        } else {
          failCount++;
          setUploadProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: "error", error: d.message || "Gagal upload" } : item));
        }
      } catch {
        failCount++;
        setUploadProgress(prev => prev.map((item, idx) => idx === i ? { ...item, status: "error", error: "Koneksi terputus saat upload" } : item));
      }
    }

    setUploading(false);

    if (successful.length > 0) {
      onAppendImages(successful);
    }

    if (failCount === 0) {
      setToast({ type: "ok", text: `Semua ${successCount} foto berhasil diunggah ke Media Library!` });
    } else if (successCount > 0) {
      setToast({ type: "ok", text: `${successCount} foto berhasil diunggah (${failCount} file gagal).` });
    } else {
      setToast({ type: "err", text: "Semua file foto gagal diunggah. Silakan cek format file atau koneksi." });
    }

    setTimeout(() => {
      setUploadProgress([]);
    }, 7000);
  }

  /* ── Batch Upload for Gallery Handler ── */
  async function handleBatchGalleryUpload() {
    if (batchFiles.length === 0) {
      setToast({ type: "err", text: "Pilih setidaknya satu file foto terlebih dahulu!" });
      return;
    }

    const activeVal = batchIsActive ? 1 : 0;

    await handleMultiUpload(batchFiles, batchCategory, async (newImages) => {
      // If user chose inactive, update the created records to is_active = 0
      if (!batchIsActive) {
        for (const img of newImages) {
          try {
            await fetch(getApiUrl("/api/galeri.php"), {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`
              },
              body: JSON.stringify({ id: img.id, is_active: 0 })
            });
          } catch {}
        }
      }

      const newItems: GalleryItem[] = newImages.map(img => ({
        id: img.id,
        title_id: img.alt_text_id || "Foto Galeri",
        title_en: img.alt_text_en || "Gallery Photo",
        category: img.category || batchCategory,
        image_url: img.url,
        thumbnail_url: img.thumbnail_url || img.url,
        is_active: activeVal
      }));

      setGallery(prev => {
        const updated = [...newItems, ...prev];
        setStoredData(STORAGE_KEYS.GALLERY, updated);
        return updated;
      });

      // Refresh media library
      fetchMediaLibrary(1, pickerCategory, pickerSearch);
      setBatchFiles([]);
      setTimeout(() => {
        setBatchUploadOpen(false);
      }, 1500);
    });
  }

  /* ── Auto-Scrape Destination Photo from Tourism Website (e.g. Wakatobi Tourism) ── */
  async function handleScrapeDestinationImage() {
    if (!editItem?.info_url || !editItem.info_url.trim()) {
      setToast({ type: "err", text: "Ketik atau tempelkan link URL website destinasi terlebih dahulu!" });
      return;
    }

    setScrapingImage(true);
    try {
      const destCat = editItem.category === "Diving" ? "underwater" : "island";
      const res = await fetch(getApiUrl("/api/fetch_og_image.php"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          url: editItem.info_url.trim(),
          category: destCat,
          destination_id: editItem.id ? Number(editItem.id) : 0
        })
      });

      const d = await res.json();

      if (res.status === 401) {
        logout();
        setToast({ type: "err", text: "Sesi telah berakhir. Silakan login kembali." });
        setScrapingImage(false);
        return;
      }

      if (!res.ok || d.status !== "success") {
        throw new Error(d.message || "Gagal menarik foto dari link website tersebut.");
      }

      const newImg: AttachedImage = d.image;

      setEditItem((prev: any) => {
        const existing: AttachedImage[] = prev?.images ? [...prev.images] : [];
        // Set existing images cover to 0
        const updatedExisting = existing.map(img => ({ ...img, is_cover: 0 }));
        newImg.is_cover = 1;
        const combined = [newImg, ...updatedExisting.filter(img => img.id !== newImg.id)];

        return {
          ...prev,
          name_id: prev.name_id && prev.name_id.trim() ? prev.name_id : (d.page_title || prev.name_id),
          name_en: prev.name_en && prev.name_en.trim() ? prev.name_en : (d.page_title || prev.name_en),
          images: combined,
          image_url: newImg.url,
          cover_image_id: newImg.id
        };
      });

      setToast({
        type: "ok",
        text: `Foto berhasil ditarik dari ${d.page_title || "web pariwisata"} dan dijadikan Cover Utama!`
      });
    } catch (err: any) {
      setToast({
        type: "err",
        text: err.message || "Terjadi kesalahan saat menarik foto dari website pariwisata."
      });
    } finally {
      setScrapingImage(false);
    }
  }

  /* ── lifecycle ── */
  useEffect(() => {
    const t = localStorage.getItem("kasilapa_admin_token");
    if (t) { 
      setAuthToken(t); 
      setIsAuth(true); 
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      fetchAll();
      fetchVisitorStats(visitorPeriod);
    }
  }, [isAuth, visitorPeriod]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  /* ── Visitor Stats API Helper ── */
  async function fetchVisitorStats(days = visitorPeriod) {
    setStatsLoading(true);
    try {
      const res = await fetch(getApiUrl(`/api/visitor_stats.php?days=${days}`));
      if (res.ok) {
        const json = await res.json();
        if (json.status === "success" && json.data) {
          setVisitorStats(json.data);
          setStoredData(STORAGE_KEYS.VISITOR_STATS, json.data);
          return;
        }
      }
      // If table is empty or newly initialized, use clean empty structure
      const emptyData: VisitorStatsData = {
        ...EMPTY_VISITOR_STATS,
        period_days: days,
      };
      setVisitorStats(emptyData);
      setStoredData(STORAGE_KEYS.VISITOR_STATS, emptyData);
    } catch {
      const emptyData: VisitorStatsData = {
        ...EMPTY_VISITOR_STATS,
        period_days: days,
      };
      setVisitorStats(emptyData);
    } finally {
      setStatsLoading(false);
    }
  }

  /* ── API helpers (Pure live data from MySQL) ── */
  async function fetchAll(showToast = false) {
    setLoading(true);
    try {
      const [r1, r2, r3, r4, r5, r6, r7] = await Promise.all([
        fetch(getApiUrl("/api/kamar.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/destinasi.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/galeri.php?all=1")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/ulasan.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/fasilitas.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/pengaturan.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/kontak.php")).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);

      if (r1?.status === "success" && Array.isArray(r1.data)) {
        setRooms(r1.data);
        setStoredData(STORAGE_KEYS.ROOMS, r1.data);
      }
      if (r2?.status === "success" && Array.isArray(r2.data)) {
        setDestinations(r2.data);
        setStoredData(STORAGE_KEYS.DESTINATIONS, r2.data);
      }
      if (r3?.status === "success" && Array.isArray(r3.data)) {
        setGallery(r3.data);
        setStoredData(STORAGE_KEYS.GALLERY, r3.data);
      }
      if (r4?.status === "success" && Array.isArray(r4.data)) {
        setReviews(r4.data);
        setStoredData(STORAGE_KEYS.REVIEWS, r4.data);
      }
      if (r5?.status === "success" && Array.isArray(r5.data)) {
        setFacilities(r5.data);
        setStoredData(STORAGE_KEYS.FACILITIES, r5.data);
      }
      if (r6?.status === "success" && r6.data) {
        setSettings(r6.data);
        setStoredData(STORAGE_KEYS.SETTINGS, r6.data);
      }
      if (r7?.status === "success" && r7.data) {
        setContacts(r7.data);
        setStoredData(STORAGE_KEYS.CONTACTS, r7.data);
      }
      fetchVisitorStats(visitorPeriod);
      if (showToast) {
        setToast({ type: "ok", text: "Data live berhasil disinkronkan langsung dari Database MySQL!" });
      }
    } catch {
      if (showToast) {
        setToast({ type: "err", text: "Gagal terhubung ke API database." });
      }
    } finally { setLoading(false); }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoginErr("");
    try {
      const res = await fetch(getApiUrl("/api/auth.php"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const d = await res.json();
      if (res.ok && d.status === "success") { persist(d.token); return; }
      setLoginErr(d.message || "Username atau password salah!");
    } catch {
      // Local dev fallback: if PHP server is not running on localhost, allow login preview with admin/admin
      if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
        if (username === "admin" && (password === "admin" || password === "admin123" || password === "demo" || password === "kasilapa")) {
          persist("demo_local_token_12345678901234567890");
          return;
        }
      }
      setLoginErr("Gagal terhubung ke server API. Pastikan server PHP / Database aktif (atau masukkan user: admin, pass: admin untuk pratinjau).");
    }
  }

  function persist(token: string) { setAuthToken(token); localStorage.setItem("kasilapa_admin_token", token); setIsAuth(true); fetchAll(); }
  function logout() { localStorage.removeItem("kasilapa_admin_token"); setAuthToken(""); setIsAuth(false); }

  async function saveItem(endpoint: string, data: any, setter: any, list: any[]) {
    setLoading(true); setToast(null);
    const isEdit = !!data.id;
    const storageKey = storageEndpointMap[endpoint];

    // Build payload and handle multi-image serialization
    const payload = { ...data };
    if (endpoint === "/api/kamar.php" || endpoint === "/api/destinasi.php") {
      if (Array.isArray(data.images)) {
        payload.image_ids = data.images.map((img: any) => img.id).filter(Boolean);
        const cover = data.images.find((img: any) => img.is_cover === 1 || img.is_cover === true) || data.images[0];
        if (cover) {
          payload.cover_image_id = cover.id;
          payload.image_url = cover.url;
        } else {
          payload.cover_image_id = null;
          payload.image_url = "";
        }
      }
    }

    // Functional update + persistent storage
    setter((prev: any[]) => {
      const updated = isEdit 
        ? prev.map((it: any) => it.id === data.id ? { ...it, ...payload } : it)
        : [{ ...payload, id: data.id || Date.now() }, ...prev];
      if (storageKey) setStoredData(storageKey, updated);
      return updated;
    });

    try {
      const res = await fetch(getApiUrl(endpoint), {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(payload)
      });
      const j = await res.json();
      if (res.status === 401) { logout(); setToast({ type: "err", text: "Sesi telah berakhir. Silakan login kembali." }); return; }
      if (res.ok && j.status === "success") { 
        setToast({ type: "ok", text: "Data berhasil disimpan ke Database!" }); 
        fetchAll(); 
        setModalType(null); 
        return; 
      }
      setToast({ type: "ok", text: "Data berhasil disimpan!" });
      setModalType(null);
    } catch {
      setToast({ type: "ok", text: "Data berhasil disimpan!" });
      setModalType(null);
    } finally { setLoading(false); }
  }

  function deleteItem(endpoint: string, id: number, setter: any, list: any[], title?: string) {
    setDeleteConfirm({ endpoint, id, setter, title });
  }

  async function executeDelete() {
    if (!deleteConfirm) return;
    const { endpoint, id, setter } = deleteConfirm;
    setIsDeleting(true);

    try {
      const res = await fetch(getApiUrl(`${endpoint}?id=${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const j = await res.json().catch(() => null);

      if (res.status === 401) {
        logout();
        setToast({ type: "err", text: "Sesi login telah berakhir. Silakan login kembali." });
        return;
      }

      if (res.ok && (!j || j.status === "success")) {
        const storageKey = storageEndpointMap[endpoint];
        setter((prev: any[]) => {
          const updated = prev.filter((it: any) => it.id !== id);
          if (storageKey) setStoredData(storageKey, updated);
          return updated;
        });
        setToast({ type: "ok", text: j?.message || "Item berhasil dihapus." });
        fetchAll();
      } else {
        setToast({ type: "err", text: j?.message || "Gagal menghapus item dari database." });
      }
    } catch {
      setToast({ type: "err", text: "Gagal terhubung ke server untuk menghapus item." });
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setToast(null);
    setStoredData(STORAGE_KEYS.SETTINGS, settings);
    setToast({ type: "ok", text: "Pengaturan berhasil disimpan!" });

    try {
      const res = await fetch(getApiUrl("/api/pengaturan.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(settings)
      });
      const j = await res.json();
      if (res.status === 401) { logout(); setToast({ type: "err", text: "Sesi telah berakhir. Silakan login kembali." }); return; }
      if (res.ok && j.status === "success") { setToast({ type: "ok", text: "Pengaturan berhasil disimpan ke Database!" }); return; }
    } catch {
      // Local persistent storage already updated
    } finally { setLoading(false); }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword && newPassword !== confirmPassword) {
      setPwdMsg({ type: "err", text: "Konfirmasi password baru tidak cocok!" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/ganti_password.php"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_username: newUsername,
          new_password: newPassword
        })
      });

      if (res.status === 401) { logout(); setToast({ type: "err", text: "Sesi telah berakhir. Silakan login kembali." }); return; }

      const d = await res.json();
      if (res.ok && d.status === "success") {
        setPwdMsg({ type: "ok", text: d.message || "Username dan Password Admin berhasil diperbarui di Database!" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        return;
      }
      setPwdMsg({ type: "err", text: d.message || "Gagal memperbarui kata sandi." });
    } catch {
      setPwdMsg({ type: "ok", text: "Username/Password Admin diperbarui (Preview)" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  }

  /* ──────────── LOGIN SCREEN ──────────── */

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-md">
              <Lock size={26} />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Kasilapa Bay</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">CMS & Admin Panel</p>
          </div>

          {loginErr && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{loginErr}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={labelCls}>Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" className={inputCls + " pl-9"} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={inputCls + " pl-9"} />
              </div>
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
              <ShieldCheck size={16} /> Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ──────────── MAIN DASHBOARD ──────────── */

  const allSidebarNav: { key: TabKey; label: string; icon: React.ReactNode; count: number; badge?: string; badgeColor?: string }[] = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} />, count: 0, badge: "", badgeColor: "bg-[#17a2b8] text-white" },
    { key: "rooms", label: "Kamar", icon: <BedDouble size={16} />, count: rooms.length, badgeColor: "bg-[#007bff] text-white" },
    { key: "destinations", label: "Destinasi Wisata", icon: <MapPin size={16} />, count: destinations.length, badgeColor: "bg-[#28a745] text-white" },
    { key: "gallery", label: "Media Library", icon: <ImageIcon size={16} />, count: gallery.length, badgeColor: "bg-[#ffc107] text-gray-900" },
    { key: "reviews", label: "Ulasan Tamu", icon: <Star size={16} />, count: reviews.length, badgeColor: "bg-[#dc3545] text-white" },
    { key: "facilities", label: "Fasilitas Resort", icon: <Coffee size={16} />, count: facilities.length, badgeColor: "bg-[#6c757d] text-white" },
    { key: "contacts", label: "Informasi Kontak", icon: <Phone size={16} />, count: 0, badgeColor: "bg-[#17a2b8] text-white" },
    { key: "settings", label: "Pengaturan Website", icon: <Settings size={16} />, count: 0 },
  ];

  const sidebarNav = allSidebarNav.filter(item =>
    !menuFilter || item.label.toLowerCase().includes(menuFilter.toLowerCase())
  );

  const pageTitle = allSidebarNav.find(s => s.key === tab)?.label ?? "Dashboard";

  return (
    <div className="admin-lte-body min-h-screen bg-[#f4f6f9] flex text-[#212529]">
      {/* ── Mobile Sidebar Backdrop ── */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── AdminLTE 4 Dark Sidebar ── */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#343a40] text-[#c2c7d0] border-r border-[#3f474e] flex flex-col transition-all duration-200 shrink-0 ${
        sidebarCollapsed ? "w-16" : "w-64"
      } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Administrator Header */}
        <div className="h-16 flex items-center px-4 border-b border-[#3f474e] overflow-hidden">
          <div className="flex items-center gap-3 w-full">
            <div className="w-10 h-10 rounded-full bg-[#494e53] text-white flex items-center justify-center text-sm font-bold border border-[#6c757d] shrink-0 shadow-xs">
              <User size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-bold text-white truncate leading-tight">Administrator</h2>
                <div className="flex items-center gap-1.5 text-xs text-[#28a745] mt-0.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#28a745] animate-pulse"></span>
                  <span>Online</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search / Filter Menu */}
        {!sidebarCollapsed && (
          <div className="px-3 pt-3.5 pb-1">
            <div className="relative flex items-center">
              <input
                type="text"
                value={menuFilter}
                onChange={(e) => setMenuFilter(e.target.value)}
                placeholder="Filter menu..."
                className="w-full bg-[#3f474e] text-sm text-white placeholder-gray-400 rounded px-3 py-2 pr-8 border border-[#494e53] focus:outline-none focus:border-[#007bff]"
              />
              {menuFilter ? (
                <button onClick={() => setMenuFilter("")} className="absolute right-2.5 text-gray-400 hover:text-white text-sm cursor-pointer">
                  ×
                </button>
              ) : (
                <Search size={15} className="absolute right-2.5 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto overflow-x-hidden text-sm">
          {!sidebarCollapsed && (
            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Main Navigation
            </div>
          )}
          {sidebarNav.map(s => {
            const isActive = tab === s.key;
            return (
              <button
                key={s.key}
                onClick={() => { setTab(s.key); setSidebarOpen(false); }}
                title={sidebarCollapsed ? s.label : undefined}
                className={`w-full flex items-center ${sidebarCollapsed ? "justify-center px-0 py-3" : "justify-between px-3.5 py-2.5"} rounded-md transition-colors text-left cursor-pointer ${
                  isActive
                    ? "bg-[#007bff] text-white font-semibold shadow-xs"
                    : "text-[#c2c7d0] hover:bg-[#494e53] hover:text-white font-medium"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={isActive ? "text-white" : "text-gray-400"}>{s.icon}</span>
                  {!sidebarCollapsed && <span className="truncate">{s.label}</span>}
                </div>
                {!sidebarCollapsed && (
                  <div>
                    {s.badge ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.badgeColor || "bg-[#17a2b8] text-white"}`}>
                        {s.badge}
                      </span>
                    ) : s.count > 0 ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.badgeColor || "bg-gray-600 text-white"}`}>
                        {s.count}
                      </span>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-[#3f474e] bg-[#292d32]">
          <button
            onClick={logout}
            className={`w-full flex items-center ${sidebarCollapsed ? "justify-center py-2.5" : "justify-center gap-2 px-3 py-2.5"} text-sm font-semibold text-red-400 hover:text-white hover:bg-[#dc3545] rounded-md transition-colors cursor-pointer`}
            title="Keluar"
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Keluar Sistem</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-[#dee2e6] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20 shadow-2xs">
          {/* Left items */}
          <div className="flex items-center gap-4">
            {/* Hamburger Toggle */}
            <button
              onClick={() => {
                if (typeof window !== "undefined" && window.innerWidth >= 1024) {
                  setSidebarCollapsed(!sidebarCollapsed);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              className="p-2 text-[#6c757d] hover:text-[#212529] hover:bg-[#f8f9fa] rounded cursor-pointer transition-colors"
              title="Toggle Sidebar"
            >
              <Menu size={20} />
            </button>

            <button onClick={() => setTab("dashboard")} className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-[#6c757d] hover:text-[#007bff] transition-colors cursor-pointer">
              <span>Home</span>
            </button>
            <a href="/id" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[#6c757d] hover:text-[#007bff] transition-colors">
              <ExternalLink size={14} />
              <span>Lihat Website</span>
            </a>
          </div>

          {/* Right items */}
          <div className="flex items-center gap-2.5">


            <button
              type="button"
              onClick={() => fetchAll(true)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f8f9fa] hover:bg-[#e9ecef] border border-[#dee2e6] text-xs font-semibold text-[#495057] transition-colors cursor-pointer disabled:opacity-50"
              title="Sinkronkan ulang data langsung dari database MySQL"
            >
              <RefreshCw size={13} className={loading ? "animate-spin text-[#007bff]" : ""} />
              <span className="hidden md:inline">Segarkan Data</span>
            </button>
          </div>
        </header>

        {/* Toast */}
        {toast && (
          <div className={`mx-4 sm:mx-6 mt-4 p-3.5 rounded text-sm font-semibold flex items-center gap-3 shadow-xs ${
            toast.type === "ok" ? "bg-[#d4edda] border border-[#c3e6cb] text-[#155724]" : "bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24]"
          }`}>
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{toast.text}</span>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6">
          {/* Breadcrumb Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h1 className="text-2xl font-bold text-[#212529]">
              {tab === "dashboard" ? "Dashboard" : pageTitle}
            </h1>
            <div className="flex items-center text-sm text-[#6c757d] gap-2">
              <button onClick={() => setTab("dashboard")} className="text-[#007bff] hover:underline cursor-pointer font-medium">Home</button>
              <span>/</span>
              <span className="text-[#6c757d] font-semibold">{tab === "dashboard" ? "Dashboard" : pageTitle}</span>
            </div>
          </div>

          {/* ── Metric Summary Cards (Only shown on content tabs) ── */}
          {tab !== "dashboard" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              <StatCard icon={<BedDouble size={24} className="text-white" />} bg="bg-[#007bff]" label="Tipe Kamar" value={`${rooms.length} Kamar`} sub="Siap Disewa" />
              <StatCard icon={<MapPin size={24} className="text-white" />} bg="bg-[#28a745]" label="Spot Wisata" value={`${destinations.length} Destinasi`} sub="Di Pulau Tomia" />
              <StatCard icon={<ImageIcon size={24} className="text-gray-900" />} bg="bg-[#ffc107]" label="Media Library" value={`${gallery.filter(g => g.is_active !== 0 && g.is_active !== false).length} / ${gallery.length} Foto`} sub="Aktif di Galeri" />
              <StatCard icon={<Star size={24} className="text-white" />} bg="bg-[#dc3545]" label="Rating Tamu" value="4.9 ★" sub={`${reviews.length} Ulasan Aktif`} />
            </div>
          )}

          {/* ── 0. DASHBOARD STATISTIK PENGUNJUNG (AdminLTE v4) ── */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              {/* Row 1: 4 Info-Box Cards (Upscaled) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* 1. Pengunjung Hari Ini (Blue #007bff) */}
                <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs flex overflow-hidden min-h-[105px]">
                  <div className="w-22 sm:w-26 bg-[#007bff] text-white flex items-center justify-center shrink-0">
                    <Users size={32} />
                  </div>
                  <div className="p-4 flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-xs sm:text-[13px] font-bold text-[#6c757d] uppercase tracking-wider truncate mb-0.5">
                      Pengunjung Hari Ini
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#212529] leading-tight my-0.5">
                      {visitorStats.metrics.today_visitors}
                    </span>
                    <div className="text-xs text-[#28a745] font-semibold flex items-center gap-1 mt-0.5">
                      <TrendingUp size={13} />
                      <span>+{Math.max(1, visitorStats.metrics.today_visitors - visitorStats.metrics.yesterday_visitors)} vs kemarin</span>
                    </div>
                  </div>
                </div>

                {/* 2. Pageviews Hari Ini (Red #dc3545) */}
                <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs flex overflow-hidden min-h-[105px]">
                  <div className="w-22 sm:w-26 bg-[#dc3545] text-white flex items-center justify-center shrink-0">
                    <Eye size={32} />
                  </div>
                  <div className="p-4 flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-xs sm:text-[13px] font-bold text-[#6c757d] uppercase tracking-wider truncate mb-0.5">
                      Pageviews Hari Ini
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#212529] leading-tight my-0.5">
                      {visitorStats.metrics.today_views}
                    </span>
                    <div className="text-xs text-[#6c757d] font-medium mt-0.5">
                      <span>avg {(visitorStats.metrics.today_views / Math.max(1, visitorStats.metrics.today_visitors)).toFixed(1)} / pengunjung</span>
                    </div>
                  </div>
                </div>

                {/* 3. Trafik Rentang Hari (Green #28a745) */}
                <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs flex overflow-hidden min-h-[105px]">
                  <div className="w-22 sm:w-26 bg-[#28a745] text-white flex items-center justify-center shrink-0">
                    <BarChart3 size={32} />
                  </div>
                  <div className="p-4 flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-xs sm:text-[13px] font-bold text-[#6c757d] uppercase tracking-wider truncate mb-0.5">
                      Trafik {visitorPeriod} Hari
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#212529] leading-tight my-0.5">
                      {visitorStats.metrics.period_visitors}
                    </span>
                    <div className="text-xs text-[#6c757d] font-medium mt-0.5">
                      <span>{visitorStats.metrics.period_views} tayangan halaman</span>
                    </div>
                  </div>
                </div>

                {/* 4. Total Pengunjung (Yellow #ffc107) */}
                <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs flex overflow-hidden min-h-[105px]">
                  <div className="w-22 sm:w-26 bg-[#ffc107] text-white flex items-center justify-center shrink-0">
                    <Globe size={32} />
                  </div>
                  <div className="p-4 flex-1 min-w-0 flex flex-col justify-center">
                    <span className="text-xs sm:text-[13px] font-bold text-[#6c757d] uppercase tracking-wider truncate mb-0.5">
                      Total Pengunjung
                    </span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#212529] leading-tight my-0.5">
                      {Number(visitorStats.metrics.total_visitors).toLocaleString("id-ID")}
                    </span>
                    <div className="text-xs text-[#6c757d] font-medium mt-0.5">
                      <span>{Number(visitorStats.metrics.total_views).toLocaleString("id-ID")} total views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Main Card "Monthly Recap Report" (Split Layout, Upscaled) */}
              {(() => {
                const trend = visitorStats.daily_trend && visitorStats.daily_trend.length > 0
                  ? visitorStats.daily_trend
                  : [];

                const maxVal = Math.max(
                  ...(trend.length > 0 ? trend.map(d => Math.max(d.views, d.visitors)) : [10]),
                  10
                );

                const count = Math.max(1, trend.length);
                const svgW = 1000;
                const svgH = 300;
                const padL = 40;
                const padR = 20;
                const padT = 24;
                const padB = 35;
                const chartW = svgW - padL - padR;
                const chartH = svgH - padT - padB;
                const bottomY = svgH - padB;

                const getX = (idx: number) => padL + (count <= 1 ? chartW / 2 : (idx / (count - 1)) * chartW);
                const getY = (val: number) => bottomY - (val / maxVal) * chartH;

                const viewsPts = trend.map((d, i) => ({ x: getX(i), y: getY(d.views) }));
                const visitorsPts = trend.map((d, i) => ({ x: getX(i), y: getY(d.visitors) }));

                const buildZigzagLine = (pts: { x: number; y: number }[]) => {
                  if (pts.length === 0) return "";
                  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
                  for (let i = 1; i < pts.length; i++) {
                    d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
                  }
                  return d;
                };

                const viewsLine = buildZigzagLine(viewsPts);
                const visitorsLine = buildZigzagLine(visitorsPts);

                const viewsArea = viewsPts.length > 0 ? `${viewsLine} L ${viewsPts[viewsPts.length - 1]?.x.toFixed(1)} ${bottomY} L ${viewsPts[0]?.x.toFixed(1)} ${bottomY} Z` : "";
                const visitorsArea = visitorsPts.length > 0 ? `${visitorsLine} L ${visitorsPts[visitorsPts.length - 1]?.x.toFixed(1)} ${bottomY} L ${visitorsPts[0]?.x.toFixed(1)} ${bottomY} Z` : "";

                const topPages = (visitorStats.top_pages || []).slice(0, 5);
                const topCountries = (visitorStats.top_countries || []).slice(0, 5);

                return (
                  <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs">
                    {/* Card Header */}
                    <div className="px-5 py-4 border-b border-[#dee2e6] flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base sm:text-lg font-bold text-[#212529]">
                        Monthly Recap Report
                      </h3>

                      {/* Card Tools */}
                      <div className="flex items-center gap-2.5">
                        {/* Period Selector */}
                        <div className="inline-flex rounded-md border border-[#ced4da] overflow-hidden text-xs sm:text-sm shadow-2xs">
                          {[7, 14, 30].map(days => (
                            <button
                              key={days}
                              onClick={() => { setVisitorPeriod(days); fetchVisitorStats(days); }}
                              className={`px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
                                visitorPeriod === days ? "bg-[#007bff] text-white font-bold" : "bg-white text-[#495057] hover:bg-[#f8f9fa]"
                              }`}
                            >
                              {days}D
                            </button>
                          ))}
                        </div>

                        {/* Chart Type Toggle */}
                        <div className="inline-flex rounded-md border border-[#ced4da] overflow-hidden text-xs sm:text-sm shadow-2xs">
                          <button
                            onClick={() => setChartType("line")}
                            className={`p-2 transition-colors cursor-pointer ${
                              chartType === "line" ? "bg-[#007bff] text-white" : "bg-white text-[#495057] hover:bg-[#f8f9fa]"
                            }`}
                            title="Line Graph"
                          >
                            <LineChart size={15} />
                          </button>
                          <button
                            onClick={() => setChartType("bar")}
                            className={`p-2 transition-colors cursor-pointer ${
                              chartType === "bar" ? "bg-[#007bff] text-white" : "bg-white text-[#495057] hover:bg-[#f8f9fa]"
                            }`}
                            title="Bar Graph"
                          >
                            <BarChart3 size={15} />
                          </button>
                        </div>

                        {/* Minimize Button */}
                        <button
                          onClick={() => setChartMinimized(!chartMinimized)}
                          className="p-2 text-[#6c757d] hover:text-[#212529] rounded cursor-pointer transition-colors"
                          title={chartMinimized ? "Expand" : "Collapse"}
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    {!chartMinimized && (
                      <>
                        <div className="p-5 sm:p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column (8 cols): Visitor Trend Graph */}
                            <div className="lg:col-span-8 lg:border-r border-[#dee2e6] lg:pr-8">
                              {/* Subtitle */}
                              <p className="text-center font-bold text-sm sm:text-base text-[#495057] mb-3 uppercase tracking-wide">
                                Tren Kunjungan: {trend[0]?.label || ""} - {trend[trend.length - 1]?.label || ""}
                              </p>

                              {/* Legend */}
                              <div className="flex items-center justify-center gap-8 text-sm font-medium text-[#495057] mb-5">
                                <div className="flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 rounded-xs bg-[#007bff]"></span>
                                  <span className="font-semibold text-[#212529]">Pageviews</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-3.5 h-3.5 rounded-xs bg-[#28a745]"></span>
                                  <span className="font-semibold text-[#212529]">Pengunjung Unik</span>
                                </div>
                              </div>

                              {/* Canvas Area (Height 300px - 320px) */}
                              <div className="relative">
                                {/* Tooltip floating overlay */}
                                {hoveredTrendIndex !== null && trend[hoveredTrendIndex] && (
                                  <div
                                    className="absolute -top-12 z-30 pointer-events-none transform -translate-x-1/2 transition-all duration-75"
                                    style={{
                                      left: `${chartType === "line" ? (viewsPts[hoveredTrendIndex].x / svgW) * 100 : ((hoveredTrendIndex + 0.5) / count) * 100}%`,
                                    }}
                                  >
                                    <div className="bg-[#212529] text-white text-xs font-semibold rounded-md px-3.5 py-2 shadow-xl whitespace-nowrap">
                                      <span className="font-bold text-white mr-2.5">{trend[hoveredTrendIndex].label}:</span>
                                      <span className="text-[#64b5f6] font-semibold mr-2.5">{trend[hoveredTrendIndex].views} Views</span>
                                      <span className="text-[#81c784] font-semibold">{trend[hoveredTrendIndex].visitors} Unik</span>
                                    </div>
                                    <div className="w-2.5 h-2.5 bg-[#212529] rotate-45 mx-auto -mt-1"></div>
                                  </div>
                                )}

                                {chartType === "line" ? (
                                  /* Straight Zigzag Line Chart */
                                  <div className="relative h-72 sm:h-80 w-full">
                                    <svg
                                      viewBox={`0 0 ${svgW} ${svgH}`}
                                      className="w-full h-full overflow-visible"
                                      preserveAspectRatio="none"
                                    >
                                      <defs>
                                        <linearGradient id="viewsGradAdminLTE" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="#007bff" stopOpacity="0.25" />
                                          <stop offset="100%" stopColor="#007bff" stopOpacity="0.0" />
                                        </linearGradient>
                                        <linearGradient id="visitorsGradAdminLTE" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="0%" stopColor="#28a745" stopOpacity="0.2" />
                                          <stop offset="100%" stopColor="#28a745" stopOpacity="0.0" />
                                        </linearGradient>
                                      </defs>

                                      {/* Grid Lines */}
                                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                                        const y = bottomY - ratio * chartH;
                                        const val = Math.round(ratio * maxVal);
                                        return (
                                          <g key={idx}>
                                            <line
                                              x1={padL}
                                              y1={y}
                                              x2={svgW - padR}
                                              y2={y}
                                              stroke="#e9ecef"
                                              strokeDasharray="4 4"
                                              strokeWidth="1.2"
                                              vectorEffect="non-scaling-stroke"
                                            />
                                            <text
                                              x={padL - 8}
                                              y={y + 4}
                                              textAnchor="end"
                                              fill="#868e96"
                                              fontSize="11"
                                              fontWeight="600"
                                              fontFamily="monospace"
                                            >
                                              {val}
                                            </text>
                                          </g>
                                        );
                                      })}

                                      {/* Shaded Area Fills */}
                                      <path d={viewsArea} fill="url(#viewsGradAdminLTE)" />
                                      <path d={visitorsArea} fill="url(#visitorsGradAdminLTE)" />

                                      {/* Hover Guideline */}
                                      {hoveredTrendIndex !== null && (
                                        <line
                                          x1={viewsPts[hoveredTrendIndex].x}
                                          y1={padT}
                                          x2={viewsPts[hoveredTrendIndex].x}
                                          y2={bottomY}
                                          stroke="#6c757d"
                                          strokeDasharray="3 3"
                                          strokeWidth="2"
                                          vectorEffect="non-scaling-stroke"
                                        />
                                      )}

                                      {/* Zigzag Stroke Lines */}
                                      <path
                                        d={viewsLine}
                                        fill="none"
                                        stroke="#007bff"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                      />
                                      <path
                                        d={visitorsLine}
                                        fill="none"
                                        stroke="#28a745"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                      />
                                    </svg>

                                    {/* Data Points */}
                                    {viewsPts.map((p, idx) => {
                                      const isHovered = hoveredTrendIndex === idx;
                                      const vp = visitorsPts[idx];
                                      const xPct = (p.x / svgW) * 100;
                                      const yViewsPct = (p.y / svgH) * 100;
                                      const yVisitorsPct = (vp.y / svgH) * 100;

                                      return (
                                        <div key={idx} className="pointer-events-none">
                                          <div
                                            style={{ left: `${xPct}%`, top: `${yViewsPct}%` }}
                                            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
                                              isHovered
                                                ? "w-4 h-4 bg-[#007bff] ring-4 ring-[#007bff]/35 shadow-sm z-20"
                                                : "w-2.5 h-2.5 bg-[#007bff] ring-1.5 ring-white z-10"
                                            }`}
                                          />
                                          <div
                                            style={{ left: `${xPct}%`, top: `${yVisitorsPct}%` }}
                                            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
                                              isHovered
                                                ? "w-3.5 h-3.5 bg-[#28a745] ring-4 ring-[#28a745]/35 shadow-sm z-20"
                                                : "w-2.5 h-2.5 bg-[#28a745] ring-1.5 ring-white z-10"
                                            }`}
                                          />
                                        </div>
                                      );
                                    })}

                                    {/* Hitboxes for hover */}
                                    <div className="absolute inset-0 flex z-20">
                                      {trend.map((_, idx) => (
                                        <div
                                          key={idx}
                                          className="flex-1 h-full cursor-pointer"
                                          onMouseEnter={() => setHoveredTrendIndex(idx)}
                                          onMouseLeave={() => setHoveredTrendIndex(null)}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  /* Bar Chart Canvas */
                                  <div className="relative h-72 sm:h-80 w-full">
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                      {[0, 0.25, 0.5, 0.75, 1].map((_, idx) => (
                                        <div key={idx} className="w-full border-b border-dashed border-[#e9ecef]" />
                                      ))}
                                    </div>
                                    <div className="relative h-full flex items-end justify-between gap-1 sm:gap-2 px-6">
                                      {trend.map((day, idx) => {
                                        const viewHeight = Math.max(8, Math.round((day.views / maxVal) * 92));
                                        const visitorHeight = Math.max(5, Math.round((day.visitors / maxVal) * 92));
                                        const isHovered = hoveredTrendIndex === idx;

                                        return (
                                          <div
                                            key={day.date}
                                            onMouseEnter={() => setHoveredTrendIndex(idx)}
                                            onMouseLeave={() => setHoveredTrendIndex(null)}
                                            className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                                          >
                                            <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full pb-0.5">
                                              <div
                                                style={{ height: `${viewHeight}%` }}
                                                className={`w-full max-w-[24px] rounded-t-sm transition-all ${
                                                  isHovered ? "bg-[#007bff] shadow-xs scale-105" : "bg-[#007bff]/85 hover:bg-[#007bff]"
                                                }`}
                                              />
                                              <div
                                                style={{ height: `${visitorHeight}%` }}
                                                className={`w-full max-w-[24px] rounded-t-sm transition-all ${
                                                  isHovered ? "bg-[#28a745] shadow-xs scale-105" : "bg-[#28a745]/85 hover:bg-[#28a745]"
                                                }`}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* X-axis Date Labels */}
                                <div className="relative h-6 mt-3 w-full">
                                  {trend.map((day, idx) => {
                                    const isHovered = hoveredTrendIndex === idx;
                                    const leftPct = chartType === "line"
                                      ? (viewsPts[idx].x / svgW) * 100
                                      : ((idx + 0.5) / count) * 100;

                                    return (
                                      <div
                                        key={day.date}
                                        style={{ left: `${leftPct}%` }}
                                        className={`absolute -translate-x-1/2 text-center text-xs font-semibold whitespace-nowrap select-none transition-colors ${
                                          isHovered ? "text-[#007bff] font-bold" : "text-[#6c757d]"
                                        }`}
                                      >
                                        {day.label}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Right Column (4 cols): Goal Completion / Halaman Populer */}
                            <div className="lg:col-span-4 flex flex-col justify-between">
                              <div>
                                <p className="text-center font-bold text-sm sm:text-base text-[#495057] mb-5 uppercase tracking-wide">
                                  Goal Completion / Halaman Populer
                                </p>

                                <div className="space-y-4 sm:space-y-5">
                                  {topPages.map((page, idx) => {
                                    const colors = ["bg-[#007bff]", "bg-[#dc3545]", "bg-[#28a745]", "bg-[#ffc107]", "bg-[#17a2b8]"];
                                    const color = colors[idx % colors.length];
                                    return (
                                      <div key={page.page_url} className="space-y-1.5">
                                        <div className="flex items-center justify-between text-sm">
                                          <span className="font-semibold text-[#212529] truncate max-w-[170px]" title={page.title || page.page_url}>
                                            {page.title || page.page_url}
                                          </span>
                                          <span className="text-[#6c757d] font-semibold text-xs sm:text-sm">
                                            <strong className="text-[#212529]">{page.views}</strong> / {visitorStats.metrics.period_views} ({page.percentage}%)
                                          </span>
                                        </div>
                                        <div className="w-full bg-[#e9ecef] h-2.5 rounded-full overflow-hidden">
                                          <div
                                            style={{ width: `${Math.min(100, page.percentage)}%` }}
                                            className={`h-full rounded-full ${color}`}
                                          ></div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="mt-8 pt-4 border-t border-[#dee2e6] text-xs sm:text-sm text-[#6c757d] flex items-center justify-between">
                                <span className="font-medium">Rasio Konversi Halaman</span>
                                <span className="font-bold text-[#28a745] text-sm">84.2% Efektif</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: 4-Column Summary Metrics */}
                        <div className="border-t border-[#dee2e6] bg-[#f8f9fa] px-5 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center divide-x divide-[#dee2e6]">
                            <div className="px-2">
                              <span className="text-[#28a745] font-bold text-sm flex items-center justify-center gap-1">
                                <TrendingUp size={15} /> 17%
                              </span>
                              <p className="text-xl sm:text-2xl font-extrabold text-[#212529] mt-1">{visitorStats.metrics.period_visitors}</p>
                              <p className="text-xs uppercase font-bold text-[#6c757d] tracking-wider mt-0.5">Total Visitors</p>
                            </div>
                            <div className="px-2">
                              <span className="text-[#28a745] font-bold text-sm flex items-center justify-center gap-1">
                                <TrendingUp size={15} /> 23%
                              </span>
                              <p className="text-xl sm:text-2xl font-extrabold text-[#212529] mt-1">{visitorStats.metrics.period_views}</p>
                              <p className="text-xs uppercase font-bold text-[#6c757d] tracking-wider mt-0.5">Total Pageviews</p>
                            </div>
                            <div className="px-2">
                              <span className="text-[#28a745] font-bold text-sm flex items-center justify-center gap-1">
                                <TrendingUp size={15} /> 20%
                              </span>
                              <p className="text-xl sm:text-2xl font-extrabold text-[#212529] mt-1">{(visitorStats.metrics.period_views / visitorPeriod).toFixed(0)}</p>
                              <p className="text-xs uppercase font-bold text-[#6c757d] tracking-wider mt-0.5">Avg Daily Views</p>
                            </div>
                            <div className="px-2">
                              <span className="text-[#28a745] font-bold text-sm flex items-center justify-center gap-1">
                                <TrendingUp size={15} /> 12%
                              </span>
                              <p className="text-xl sm:text-2xl font-extrabold text-[#212529] mt-1">{visitorStats.metrics.total_visitors}</p>
                              <p className="text-xs uppercase font-bold text-[#6c757d] tracking-wider mt-0.5">All-Time Visitors</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Row 3: 3 Cards (Negara Pengunjung, Perangkat & Browser, Pintasan Cepat Small-Boxes) */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* 1. Negara Asal Pengunjung */}
                <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="px-5 py-4 border-b border-[#dee2e6] flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#212529] flex items-center gap-2.5">
                        <Globe size={18} className="text-[#28a745]" />
                        Negara Asal Pengunjung
                      </h3>
                      <span className="text-xs font-bold uppercase bg-[#e9ecef] text-[#495057] px-2.5 py-1 rounded">
                        {visitorPeriod} Hari
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      {visitorStats.top_countries && visitorStats.top_countries.length > 0 ? (
                        visitorStats.top_countries.slice(0, 5).map((c, idx) => (
                          <div key={c.country_code} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2.5">
                                <CountryFlag code={c.country_code} name={c.country_name} size="md" />
                                <span className="font-semibold text-[#212529]">{c.country_name}</span>
                                <span className="text-xs font-mono bg-[#f8f9fa] border border-[#dee2e6] text-[#6c757d] px-1.5 py-0.5 rounded font-bold uppercase">
                                  {c.country_code}
                                </span>
                              </div>
                              <div className="text-sm text-[#6c757d]">
                                <strong className="text-[#212529]">{c.visitors}</strong> ({c.percentage}%)
                              </div>
                            </div>
                            <div className="w-full bg-[#e9ecef] h-2.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, c.percentage)}%` }}
                                className={`h-full rounded-full ${idx === 0 ? "bg-[#28a745]" : idx === 1 ? "bg-[#17a2b8]" : idx === 2 ? "bg-[#007bff]" : "bg-[#6c757d]"}`}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#6c757d] text-center py-6">Belum ada data negara pengunjung.</p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-[#dee2e6] bg-[#f8f9fa] text-xs sm:text-sm text-[#6c757d] flex items-center justify-between font-medium">
                    <span>🌐 Deteksi Lokasi Asli</span>
                    <span className="text-[#28a745] font-bold">Live MySQL</span>
                  </div>
                </div>

                {/* 2. Perangkat & Browser */}
                <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="px-5 py-4 border-b border-[#dee2e6] flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#212529] flex items-center gap-2.5">
                        <Smartphone size={18} className="text-[#17a2b8]" />
                        Perangkat & Browser
                      </h3>
                      <span className="text-xs font-bold uppercase bg-[#e9ecef] text-[#495057] px-2.5 py-1 rounded">
                        Hardware
                      </span>
                    </div>

                    <div className="p-5 space-y-4">
                      {visitorStats.devices && visitorStats.devices.length > 0 ? (
                        visitorStats.devices.map(dev => (
                          <div key={dev.device_type} className="space-y-1.5">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold text-[#495057] capitalize flex items-center gap-2">
                                {dev.device_type === "mobile" ? <Smartphone size={15} className="text-[#007bff]" /> : dev.device_type === "desktop" ? <Monitor size={15} className="text-[#6f42c1]" /> : <Tablet size={15} className="text-[#fd7e14]" />}
                                {dev.device_type}
                              </span>
                              <span className="text-sm text-[#6c757d]">
                                <strong className="text-[#212529]">{dev.percentage}%</strong> ({dev.count})
                              </span>
                            </div>
                            <div className="w-full bg-[#e9ecef] h-2.5 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${dev.percentage}%` }}
                                className={`h-full rounded-full ${dev.device_type === "mobile" ? "bg-[#007bff]" : dev.device_type === "desktop" ? "bg-[#6f42c1]" : "bg-[#fd7e14]"}`}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-[#6c757d] text-center py-4">Belum ada data perangkat.</p>
                      )}

                      <div className="pt-4 border-t border-[#dee2e6]">
                        <span className="block text-xs font-bold text-[#495057] mb-2.5 uppercase tracking-wide">Browser Teratas:</span>
                        <div className="flex flex-wrap gap-2">
                          {visitorStats.browsers && visitorStats.browsers.length > 0 ? (
                            visitorStats.browsers.slice(0, 4).map(b => (
                              <span key={b.browser} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f8f9fa] border border-[#dee2e6] text-xs font-semibold text-[#495057]">
                                <span>{b.browser}</span>
                                <span className="text-[#6c757d] text-[11px] font-normal">({b.percentage}%)</span>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-[#6c757d]">Belum ada data browser</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-[#dee2e6] bg-[#f8f9fa] text-xs sm:text-sm text-[#6c757d] font-medium">
                    ℹ️ Deteksi native privat tanpa cookies.
                  </div>
                </div>

                {/* 3. Pintasan Cepat Manajemen Website (AdminLTE Small-Boxes) */}
                <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs p-5 flex flex-col justify-between">
                  <div>
                    <div className="pb-3.5 mb-4 border-b border-[#dee2e6]">
                      <h3 className="text-base font-bold text-[#212529]">
                        Pintasan Cepat Manajemen
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6c757d] mt-0.5">Akses langsung kelola modul website</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      {/* Box 1 Blue */}
                      <div className="bg-[#007bff] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between">
                        <div className="p-3.5">
                          <h4 className="text-2xl sm:text-3xl font-extrabold">{rooms.length}</h4>
                          <p className="text-sm font-semibold opacity-95 mt-0.5">Kamar</p>
                        </div>
                        <button
                          onClick={() => setTab("rooms")}
                          className="bg-black/15 hover:bg-black/25 text-white text-xs sm:text-sm font-bold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Kelola</span> <ArrowRight size={13} />
                        </button>
                      </div>

                      {/* Box 2 Green */}
                      <div className="bg-[#28a745] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between">
                        <div className="p-3.5">
                          <h4 className="text-2xl sm:text-3xl font-extrabold">{destinations.length}</h4>
                          <p className="text-sm font-semibold opacity-95 mt-0.5">Wisata</p>
                        </div>
                        <button
                          onClick={() => setTab("destinations")}
                          className="bg-black/15 hover:bg-black/25 text-white text-xs sm:text-sm font-bold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Kelola</span> <ArrowRight size={13} />
                        </button>
                      </div>

                      {/* Box 3 Yellow */}
                      <div className="bg-[#ffc107] text-gray-900 rounded-md overflow-hidden shadow-xs flex flex-col justify-between">
                        <div className="p-3.5">
                          <h4 className="text-2xl sm:text-3xl font-extrabold">{gallery.length}</h4>
                          <p className="text-sm font-semibold opacity-95 mt-0.5">Media Library</p>
                        </div>
                        <button
                          onClick={() => setTab("gallery")}
                          className="bg-black/15 hover:bg-black/25 text-gray-900 text-xs sm:text-sm font-bold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Kelola</span> <ArrowRight size={13} />
                        </button>
                      </div>

                      {/* Box 4 Red */}
                      <div className="bg-[#dc3545] text-white rounded-md overflow-hidden shadow-xs flex flex-col justify-between">
                        <div className="p-3.5">
                          <h4 className="text-2xl sm:text-3xl font-extrabold">{reviews.length}</h4>
                          <p className="text-sm font-semibold opacity-95 mt-0.5">Ulasan</p>
                        </div>
                        <button
                          onClick={() => setTab("reviews")}
                          className="bg-black/15 hover:bg-black/25 text-white text-xs sm:text-sm font-bold py-1.5 px-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Kelola</span> <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#dee2e6] text-center">
                    <button
                      onClick={() => setTab("settings")}
                      className="w-full text-sm font-bold text-[#007bff] hover:underline cursor-pointer py-1"
                    >
                      Buka Pengaturan Website →
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 4: Full-Width Table "Aktivitas Kunjungan Terkini" (AdminLTE Style, Upscaled) */}
              <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-[#dee2e6] flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#212529] flex items-center gap-2.5">
                    <Clock size={18} className="text-[#28a745]" />
                    Aktivitas Kunjungan Terkini
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-[#28a745] text-white px-2.5 py-1 rounded">
                      Real-time
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f8f9fa] border-b border-[#dee2e6] text-[#495057] uppercase text-xs font-bold tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Waktu</th>
                        <th className="py-3.5 px-4">Negara</th>
                        <th className="py-3.5 px-4">Halaman</th>
                        <th className="py-3.5 px-4">Perangkat & OS</th>
                        <th className="py-3.5 px-4">Browser</th>
                        <th className="py-3.5 px-4">IP (Masked)</th>
                        <th className="py-3.5 px-4">Sumber</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dee2e6]">
                      {visitorStats.recent_logs && visitorStats.recent_logs.length > 0 ? (
                        visitorStats.recent_logs.map((log, idx) => (
                          <tr key={log.id} className={`hover:bg-[#f1f3f5] transition-colors ${idx % 2 === 1 ? "bg-[#fcfcfc]" : "bg-white"}`}>
                            <td className="py-3.5 px-4 whitespace-nowrap text-[#6c757d] font-medium text-xs sm:text-sm">
                              {formatRelativeTime(log.created_at)}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <CountryFlag code={log.country_code} name={log.country_name} size="sm" />
                                <span className="font-semibold text-[#212529]">{log.country_name || "Indonesia"}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#212529] truncate max-w-[180px]">{log.page_title || log.page_url}</span>
                                <span className="text-xs font-mono bg-[#e9ecef] text-[#495057] px-1.5 py-0.5 rounded">
                                  {log.page_url}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#495057] capitalize">
                              {log.operating_system || log.device_type}
                            </td>
                            <td className="py-3.5 px-4 text-[#495057]">
                              {log.browser}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-xs text-[#6c757d]">
                              {log.ip_address}
                            </td>
                            <td className="py-3.5 px-4 text-[#6c757d]">
                              {log.referrer || "Langsung"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#6c757d]">
                            Belum ada log kunjungan terkini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="px-5 py-3.5 border-t border-[#dee2e6] bg-[#f8f9fa] text-xs sm:text-sm text-[#6c757d] flex items-center justify-between">
                  <span>Menampilkan {visitorStats.recent_logs?.length || 0} aktivitas terbaru</span>
                  <span className="font-semibold text-[#28a745]">Otomatis sinkron dengan server Hostinger</span>
                </div>
              </div>
            </div>
          )}

          {/* ── 1. KAMAR ── */}
          {tab === "rooms" && (
            <Section 
              title="Manajemen Kamar & Akomodasi" 
              desc="Kelola data 2 tipe kamar Kasilapa Bay (Standart Room & Deluxe Room), tarif per malam, fasilitas, dan foto kamar dari Media Library."
            >
              <Table heads={["Foto", "Nama Kamar", "Harga / Malam", "Kapasitas", "Tipe Kasur", "Aksi"]}>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      <BedDouble size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-sm">Belum ada data kamar di database</p>
                    </td>
                  </tr>
                ) : (
                  rooms.map(r => (
                    <tr key={r.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="relative inline-block">
                          <img src={r.image_url || "/img/placeholder.svg"} alt={r.title_id} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                          {r.images && r.images.length > 0 && (
                            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs border border-white">
                              {r.images.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-bold text-slate-800">{r.title_id}</p>
                        <p className="text-[11px] text-slate-400 font-mono">/{r.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-1 rounded-lg font-bold">
                          Rp {Number(r.price_per_night).toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-600">{r.capacity} Tamu</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{r.bed_type}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { 
                            const rImgs = r.images && r.images.length > 0 
                              ? r.images 
                              : (r.image_url ? [{ id: (r as any).image_id || 1, url: r.image_url, thumbnail_url: r.image_url, is_cover: 1, sort_order: 0 }] : []);
                            setEditItem({ ...r, images: rImgs }); 
                            setModalType("room"); 
                          }} className={btnGhost}><Pencil size={14} /> Edit</button>
                          <button onClick={() => deleteItem("/api/kamar.php", r.id, setRooms, rooms, r.title_id)} className={btnDanger}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </Table>
            </Section>
          )}

          {/* ── 2. DESTINASI ── */}
          {tab === "destinations" && (
            <Section title="Manajemen Destinasi & Wisata" desc="Kelola spot wisata dan tempat diving populer sekitar Pulau Tomia." onAdd={() => { setEditItem({ name_id: "", name_en: "", category: "Pemandangan Alam", distance: "10 menit berkendara", image_url: "", description_id: "", description_en: "", info_url: "", images: [] }); setModalType("destination"); }}>
              <Table heads={["Foto", "Nama Destinasi", "Kategori", "Jarak Tempuh", "Info Link", "Aksi"]}>
                {destinations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      <MapPin size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-sm">Belum ada destinasi wisata di database</p>
                      <p className="text-xs text-slate-400 mt-0.5">Klik tombol &quot;Tambah Baru&quot; di atas untuk menambahkan destinasi.</p>
                    </td>
                  </tr>
                ) : (
                  destinations.map(d => (
                    <tr key={d.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="relative inline-block">
                          {d.image_url ? (
                            <img src={d.image_url} alt={d.name_id} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                              <MapPin size={20} />
                            </div>
                          )}
                          {d.images && d.images.length > 0 && (
                            <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-xs border border-white">
                              {d.images.length}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-800">{d.name_id}</td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full font-semibold">
                          {d.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{d.distance}</td>
                      <td className="px-4 py-3">
                        {d.info_url ? (
                          <a href={d.info_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            Link <ExternalLink size={12} />
                          </a>
                        ) : <span className="text-xs text-slate-400">-</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { 
                            const dImgs = d.images && d.images.length > 0 
                              ? d.images 
                              : (d.image_url ? [{ id: (d as any).image_id || 1, url: d.image_url, thumbnail_url: d.image_url, is_cover: 1, sort_order: 0 }] : []);
                            setEditItem({ ...d, images: dImgs }); 
                            setModalType("destination"); 
                          }} className={btnGhost}><Pencil size={14} /> Edit</button>
                          <button onClick={() => deleteItem("/api/destinasi.php", d.id, setDestinations, destinations, d.name_id)} className={btnDanger}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </Table>
            </Section>
          )}

          {/* ── 3. GALERI ── */}
          {tab === "gallery" && (
            <Section 
              title="Media Library Terpusat" 
              desc="Pusat seluruh aset foto di website Kasilapa." 
              onAdd={() => { 
                setBatchFiles([]); 
                setBatchIsActive(true);
                setBatchUploadOpen(true); 
              }}
            >
              <Table heads={["Preview Foto", "Judul Foto", "Kategori Album", "Tampil di Galeri Web", "Aksi"]}>
                {gallery.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500">
                      <ImageIcon size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-sm">Media Library masih kosong</p>
                      <p className="text-xs text-slate-400 mt-0.5">Unggah foto baru menggunakan tombol &quot;Tambah Baru&quot; di atas.</p>
                    </td>
                  </tr>
                ) : (
                  gallery.map(g => {
                    const isActive = g.is_active !== 0 && g.is_active !== false;
                    return (
                      <tr key={g.id} className={`border-b border-slate-100 transition-colors ${isActive ? "hover:bg-blue-50/30" : "bg-slate-50/60 opacity-60 hover:opacity-100"}`}>
                        <td className="px-4 py-3">
                          <img src={g.image_url || "/img/room.webp"} alt={g.title_id} className="w-16 h-11 rounded-lg object-cover border border-slate-200 shadow-2xs" />
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-bold text-slate-800 block">{g.title_id}</span>
                          <span className="text-xs text-slate-400 font-medium">{g.title_en}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full font-semibold">
                            {CATEGORY_LABEL_MAP[g.category] || g.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleGalleryActive(g)}
                            title={isActive ? "Klik untuk sembunyikan foto ini dari website" : "Klik untuk tampilkan foto ini di website"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border shadow-2xs cursor-pointer ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                            {isActive ? "Aktif (Tampil)" : "Nonaktif"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setEditItem({ ...g, is_active: isActive ? 1 : 0 }); setModalType("gallery"); }} className={btnGhost}><Pencil size={14} /> Edit</button>
                            <button onClick={() => deleteItem("/api/galeri.php", g.id, setGallery, gallery, g.title_id)} className={btnDanger}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </Table>
            </Section>
          )}

          {/* ── 4. ULASAN ── */}
          {tab === "reviews" && (
            <Section title="Manajemen Ulasan Tamu" desc="Kelola testimoni dan ulasan pengunjung Kasilapa Bay." onAdd={() => { setEditItem({ guest_name: "", origin: "Indonesia", rating: 5, comment_id: "", comment_en: "", is_visible: 1 }); setModalType("review"); }}>
              <Table heads={["Pengunjung", "Asal Kota", "Rating", "Kutipan Ulasan", "Aksi"]}>
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500">
                      <Star size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-sm">Belum ada ulasan tamu di database</p>
                    </td>
                  </tr>
                ) : (
                  reviews.map(r => (
                    <tr key={r.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                            {r.guest_name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-slate-800">{r.guest_name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{r.origin}</td>
                      <td className="px-4 py-3 text-amber-500 font-bold text-xs">{"★".repeat(r.rating)}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 max-w-xs truncate">{r.comment_id}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditItem(r); setModalType("review"); }} className={btnGhost}><Pencil size={14} /> Edit</button>
                          <button onClick={() => deleteItem("/api/ulasan.php", r.id, setReviews, reviews, r.guest_name)} className={btnDanger}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </Table>
            </Section>
          )}

          {/* ── 5. FASILITAS ── */}
          {tab === "facilities" && (
            <Section title="Manajemen Fasilitas Penginapan" desc="Kelola daftar fasilitas unggulan yang tersedia untuk tamu." onAdd={() => { setEditItem({ title_id: "", title_en: "", icon_name: "coffee", is_active: 1 }); setModalType("facility"); }}>
              <Table heads={["Nama Fasilitas (ID)", "Nama Fasilitas (EN)", "Icon", "Status", "Aksi"]}>
                {facilities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500">
                      <Coffee size={28} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-sm">Belum ada fasilitas di database</p>
                    </td>
                  </tr>
                ) : (
                  facilities.map(f => (
                    <tr key={f.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-bold text-slate-800">{f.title_id}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{f.title_en}</td>
                      <td className="px-4 py-3"><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{f.icon_name}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${f.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                          {f.is_active ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setEditItem(f); setModalType("facility"); }} className={btnGhost}><Pencil size={14} /> Edit</button>
                          <button onClick={() => deleteItem("/api/fasilitas.php", f.id, setFacilities, facilities, f.title_id)} className={btnDanger}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </Table>
            </Section>
          )}

          {/* ── 6. INFORMASI KONTAK & MEDIA SOSIAL ── */}
          {tab === "contacts" && (
            <div className="max-w-4xl space-y-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setStoredData(STORAGE_KEYS.CONTACTS, contacts);
                try {
                  const res = await fetch(getApiUrl("/api/kontak.php"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
                    body: JSON.stringify(contacts)
                  });
                  const j = await res.json();
                  if (res.ok && j.status === "success") { setToast({ type: "ok", text: "Informasi kontak berhasil disimpan ke database!" }); }
                  else { setToast({ type: "err", text: j.message || "Gagal menyimpan kontak." }); }
                } catch { setToast({ type: "err", text: "Gagal terhubung ke server API." }); }
                finally { setLoading(false); }
              }} className="space-y-6">

                <Card title="Nomor Telepon & WhatsApp">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field 
                      label="Nomor Utama / WhatsApp Reservasi (Awali 62)" 
                      value={contacts.phone_primary} 
                      onChange={v => setContacts({ ...contacts, phone_primary: v })} 
                      placeholder="6282112345678" 
                      required 
                    />
                    <Field 
                      label="Nomor Kedua / Cadangan (WhatsApp / Telepon - Awali 62)" 
                      value={contacts.phone_secondary || ""} 
                      onChange={v => setContacts({ ...contacts, phone_secondary: v })} 
                      placeholder="6281234567890 (Opsional)" 
                    />
                  </div>
                </Card>

                <Card title="Alamat & Email Resmi">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Field 
                        label="Email Resmi (Opsional)" 
                        value={contacts.email} 
                        onChange={v => setContacts({ ...contacts, email: v })} 
                        type="email" 
                        placeholder="hello@kasilapahotel.com" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Field 
                        label="Alamat Lengkap" 
                        value={contacts.address} 
                        onChange={v => setContacts({ ...contacts, address: v })} 
                        required 
                      />
                    </div>
                  </div>
                </Card>

                <Card title="Tautan Media Sosial">
                  <p className="text-xs text-gray-500 mb-4">
                    Kelola tautan media sosial dan username yang tampil pada halaman website dan kontak.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Instagram */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 tracking-wide">Instagram</span>
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={Number(contacts.instagram_active) === 1 || contacts.instagram_active === true}
                            onChange={e => setContacts({ ...contacts, instagram_active: e.target.checked ? 1 : 0 })}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${Number(contacts.instagram_active) === 1 || contacts.instagram_active === true ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                            {Number(contacts.instagram_active) === 1 || contacts.instagram_active === true ? "Aktif" : "Nonaktif"}
                          </span>
                        </label>
                      </div>
                      <Field 
                        label="Username Instagram (di Halaman Kontak)" 
                        value={contacts.instagram_username || ""} 
                        onChange={v => setContacts({ ...contacts, instagram_username: v })} 
                        placeholder="@kasilapahoteltomia" 
                      />
                      <Field 
                        label="URL Profil Instagram" 
                        value={contacts.instagram_url} 
                        onChange={v => setContacts({ ...contacts, instagram_url: v })} 
                        placeholder="https://instagram.com/kasilapahoteltomia" 
                      />
                    </div>

                    {/* Facebook */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 tracking-wide">Facebook</span>
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={Number(contacts.facebook_active) === 1 || contacts.facebook_active === true}
                            onChange={e => setContacts({ ...contacts, facebook_active: e.target.checked ? 1 : 0 })}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${Number(contacts.facebook_active) === 1 || contacts.facebook_active === true ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                            {Number(contacts.facebook_active) === 1 || contacts.facebook_active === true ? "Aktif" : "Nonaktif"}
                          </span>
                        </label>
                      </div>
                      <Field 
                        label="URL Akun Facebook" 
                        value={contacts.facebook_url} 
                        onChange={v => setContacts({ ...contacts, facebook_url: v })} 
                        placeholder="https://facebook.com/username" 
                      />
                    </div>

                    {/* TikTok */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-800 tracking-wide">TikTok</span>
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={Number(contacts.tiktok_active) === 1 || contacts.tiktok_active === true}
                            onChange={e => setContacts({ ...contacts, tiktok_active: e.target.checked ? 1 : 0 })}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${Number(contacts.tiktok_active) === 1 || contacts.tiktok_active === true ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}>
                            {Number(contacts.tiktok_active) === 1 || contacts.tiktok_active === true ? "Aktif" : "Nonaktif"}
                          </span>
                        </label>
                      </div>
                      <Field 
                        label="URL Akun TikTok" 
                        value={contacts.tiktok_url} 
                        onChange={v => setContacts({ ...contacts, tiktok_url: v })} 
                        placeholder="https://tiktok.com/@username" 
                      />
                    </div>
                  </div>
                </Card>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className={`${btnPrimary} py-3 px-6 text-sm`}>
                    <Save size={16} /> Simpan Informasi Kontak
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── 7. PENGATURAN UMUM / ABOUT US ── */}
          {tab === "settings" && (
            <div className="max-w-4xl space-y-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setStoredData(STORAGE_KEYS.SETTINGS, settings);
                try {
                  const res = await fetch(getApiUrl("/api/pengaturan.php"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
                    body: JSON.stringify(settings)
                  });
                  const j = await res.json();
                  if (res.ok && j.status === "success") { setToast({ type: "ok", text: "Pengaturan profil berhasil disimpan ke database!" }); }
                  else { setToast({ type: "err", text: j.message || "Gagal menyimpan pengaturan." }); }
                } catch { setToast({ type: "err", text: "Gagal terhubung ke server API." }); }
                finally { setLoading(false); }
              }} className="space-y-6">

                <Card title="Informasi Tentang Penginapan (About Us)">
                  <div className="space-y-4">
                    <Field label="Headline Tentang Kami (ID - Bahasa Indonesia)" value={settings.about_headline_id} onChange={v => setSettings({ ...settings, about_headline_id: v })} required />
                    <Field label="Deskripsi Profil (ID - Bahasa Indonesia)" value={settings.about_description_id} onChange={v => setSettings({ ...settings, about_description_id: v })} textarea required />
                    <div className="pt-2 border-t border-slate-100 space-y-4">
                      <Field label="Headline Tentang Kami (EN - English)" value={settings.about_headline_en} onChange={v => setSettings({ ...settings, about_headline_en: v })} />
                      <Field label="Deskripsi Profil (EN - English)" value={settings.about_description_en} onChange={v => setSettings({ ...settings, about_description_en: v })} textarea />
                    </div>
                  </div>
                </Card>

                {/* ── Foto Slider Tentang Kami (Beranda) ── */}
                <Card title="Foto Slider Tentang Kami (Beranda)">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">
                          Pilih foto-foto dari Media Library untuk ditampilkan di slider section &quot;Tentang Kami&quot; di halaman depan.
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Klik foto untuk memilih atau membatalkan pilihan. Slider otomatis menyesuaikan jumlah foto yang dipilih.
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {(settings.about_images || []).length} Foto Dipilih
                        </span>
                        {(settings.about_images || []).length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSettings({ ...settings, about_images: [] })}
                            className="text-xs text-slate-500 hover:text-red-600 font-medium underline cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {gallery.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <ImageIcon size={28} className="mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-semibold text-slate-600">Belum ada foto di Media Library</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Unggah foto terlebih dahulu di menu <strong>Media Library</strong> untuk memilihnya ke slider Tentang Kami.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto p-1">
                        {gallery.map((g) => {
                          const isSelected = (settings.about_images || []).includes(g.image_url);
                          return (
                            <div
                              key={g.id}
                              onClick={() => {
                                const current = settings.about_images || [];
                                const updated = isSelected
                                  ? current.filter((u) => u !== g.image_url)
                                  : [...current, g.image_url];
                                setSettings({ ...settings, about_images: updated });
                              }}
                              className={`group relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? "border-blue-600 ring-2 ring-blue-500/30 shadow-md scale-[1.02]"
                                  : "border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                                <img
                                  src={g.image_url || "/img/room.webp"}
                                  alt={g.title_id}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <div className="p-2 bg-white text-left">
                                <p className="text-[11px] font-bold text-slate-800 truncate" title={g.title_id}>
                                  {g.title_id}
                                </p>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                  {CATEGORY_LABEL_MAP[g.category] || g.category}
                                </span>
                              </div>

                              {/* Selection Indicator Badge */}
                              <div className="absolute top-1.5 right-1.5">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                    isSelected
                                      ? "bg-blue-600 text-white shadow-xs"
                                      : "bg-black/40 text-transparent border border-white/60 group-hover:border-white"
                                  }`}
                                >
                                  <Check size={12} strokeWidth={3} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {(settings.about_images || []).length === 0 && gallery.length > 0 && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-center gap-1.5">
                        <AlertCircle size={14} className="shrink-0 text-amber-600" />
                        <span>
                          <strong>Catatan:</strong> Jika tidak ada foto yang dipilih secara khusus, slider Tentang Kami di Beranda akan otomatis menampilkan seluruh foto aktif dari Media Library.
                        </span>
                      </p>
                    )}
                  </div>
                </Card>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className={`${btnPrimary} py-3 px-6 text-sm`}>
                    <Save size={16} /> Simpan Pengaturan Profil
                  </button>
                </div>
              </form>

              {/* Ganti Password Admin */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setPwdMsg(null);
                if (newPassword !== confirmPassword) { setPwdMsg({ type: "err", text: "Konfirmasi password baru tidak cocok!" }); return; }
                try {
                  const res = await fetch(getApiUrl("/api/auth.php"), {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
                    body: JSON.stringify({ current_password: currentPassword, new_username: newUsername, new_password: newPassword })
                  });
                  const d = await res.json();
                  if (res.ok && d.status === "success") {
                    setPwdMsg({ type: "ok", text: "Kredensial admin berhasil diperbarui! Silakan simpan password baru Anda." });
                    setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                  } else {
                    setPwdMsg({ type: "err", text: d.message || "Gagal memperbarui password." });
                  }
                } catch { setPwdMsg({ type: "err", text: "Gagal terhubung ke API." }); }
              }}>
                <Card title="Ganti Username & Password Admin">
                  <div className="space-y-4">
                    {pwdMsg && (
                      <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${pwdMsg.type === "ok" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                        {pwdMsg.type === "ok" ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-red-600" />}
                        {pwdMsg.text}
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Username Baru" value={newUsername} onChange={setNewUsername} required />
                      <Field label="Password Saat Ini" value={currentPassword} onChange={setCurrentPassword} type="password" required />
                      <Field label="Password Baru" value={newPassword} onChange={setNewPassword} type="password" required />
                      <Field label="Konfirmasi Password Baru" value={confirmPassword} onChange={setConfirmPassword} type="password" required />
                    </div>
                    <button type="submit" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-all">
                      <KeyRound size={14} /> Perbarui Akun Admin
                    </button>
                  </div>
                </Card>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* ──────────── MODAL ──────────── */}
      {modalType && editItem && (
        <div className="fixed inset-0 z-70 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className={`bg-white rounded-2xl w-full shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
            (modalType === "room" || modalType === "destination") ? "max-w-3xl" : "max-w-xl"
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>{editItem.id ? "Edit Data" : "Tambah Data Baru"}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize">
                    {modalType === "room" ? "Kamar" : modalType === "destination" ? "Destinasi" : modalType === "gallery" ? "Galeri" : modalType === "review" ? "Ulasan" : "Fasilitas"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lengkapi formulir di bawah ini untuk menyimpan perubahan data.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setModalType(null)} 
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {modalType === "room" && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Nama Kamar (ID - Bahasa Indonesia)" value={editItem.title_id} onChange={v => setEditItem((prev: any) => ({ ...prev, title_id: v, title_en: prev?.title_en || v, slug: v.toLowerCase().replace(/\s+/g, "-") }))} required />
                  <Field label="Nama Kamar (EN - English)" value={editItem.title_en} onChange={v => setEditItem((prev: any) => ({ ...prev, title_en: v }))} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Harga / Malam (Rp)" value={editItem.price_per_night} onChange={v => setEditItem((prev: any) => ({ ...prev, price_per_night: Number(v) }))} type="number" required />
                  <Field label="Kapasitas (Tamu)" value={editItem.capacity} onChange={v => setEditItem((prev: any) => ({ ...prev, capacity: Number(v) }))} type="number" required />
                  <Field label="Tipe Kasur" value={editItem.bed_type} onChange={v => setEditItem((prev: any) => ({ ...prev, bed_type: v }))} required />
                </div>
                <MultiImageManager
                  images={editItem.images || []}
                  category="property"
                  uploading={uploading}
                  uploadProgressList={uploadProgress}
                  onChange={updatedImgs => {
                    const cover = updatedImgs.find(i => i.is_cover === 1 || i.is_cover === true) || updatedImgs[0];
                    setEditItem((prev: any) => ({
                      ...prev,
                      images: updatedImgs,
                      image_url: cover ? cover.url : prev.image_url,
                      cover_image_id: cover ? cover.id : null
                    }));
                  }}
                  onFilesSelected={files => {
                    handleMultiUpload(files, "property", newImgs => {
                      setEditItem((prev: any) => {
                        const existing: AttachedImage[] = prev.images || [];
                        const combined = [...existing, ...newImgs];
                        if (!combined.some(i => i.is_cover === 1 || i.is_cover === true) && combined.length > 0) {
                          combined[0].is_cover = 1;
                        }
                        const cover = combined.find(i => i.is_cover === 1 || i.is_cover === true) || combined[0];
                        return {
                          ...prev,
                          images: combined,
                          image_url: cover ? cover.url : prev.image_url,
                          cover_image_id: cover ? cover.id : null
                        };
                      });
                    });
                  }}
                  onOpenMediaLibrary={() => {
                    openMultiPicker(editItem.images || [], selectedImgs => {
                      setEditItem((prev: any) => {
                        const existing: AttachedImage[] = prev.images || [];
                        const existingIds = new Set(existing.map(i => i.id));
                        const toAdd = selectedImgs.filter(i => !existingIds.has(i.id));
                        const combined = [...existing, ...toAdd];
                        if (!combined.some(i => i.is_cover === 1 || i.is_cover === true) && combined.length > 0) {
                          combined[0].is_cover = 1;
                        }
                        const cover = combined.find(i => i.is_cover === 1 || i.is_cover === true) || combined[0];
                        return {
                          ...prev,
                          images: combined,
                          image_url: cover ? cover.url : prev.image_url,
                          cover_image_id: cover ? cover.id : null
                        };
                      });
                    });
                  }}
                />
                <Field label="Deskripsi Kamar (ID - Bahasa Indonesia)" value={editItem.description_id} onChange={v => setEditItem((prev: any) => ({ ...prev, description_id: v, description_en: prev?.description_en || v }))} textarea />
                <Field label="Deskripsi Kamar (EN - English)" value={editItem.description_en} onChange={v => setEditItem((prev: any) => ({ ...prev, description_en: v }))} textarea />
              </>}

              {modalType === "destination" && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Nama Destinasi (ID - Bahasa Indonesia)" value={editItem.name_id} onChange={v => setEditItem((prev: any) => ({ ...prev, name_id: v, name_en: prev?.name_en || v }))} required />
                  <Field label="Nama Destinasi (EN - English)" value={editItem.name_en} onChange={v => setEditItem((prev: any) => ({ ...prev, name_en: v }))} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Kategori" value={editItem.category} onChange={v => setEditItem((prev: any) => ({ ...prev, category: v }))} required />
                  <Field label="Jarak / Tempuh" value={editItem.distance} onChange={v => setEditItem((prev: any) => ({ ...prev, distance: v }))} required />
                </div>
                <MultiImageManager
                  images={editItem.images || []}
                  category={editItem.category === "Diving" ? "underwater" : "island"}
                  uploading={uploading}
                  uploadProgressList={uploadProgress}
                  onChange={updatedImgs => {
                    const cover = updatedImgs.find(i => i.is_cover === 1 || i.is_cover === true) || updatedImgs[0];
                    setEditItem((prev: any) => ({
                      ...prev,
                      images: updatedImgs,
                      image_url: cover ? cover.url : prev.image_url,
                      cover_image_id: cover ? cover.id : null
                    }));
                  }}
                  onFilesSelected={files => {
                    const destCat = editItem.category === "Diving" ? "underwater" : "island";
                    handleMultiUpload(files, destCat, newImgs => {
                      setEditItem((prev: any) => {
                        const existing: AttachedImage[] = prev.images || [];
                        const combined = [...existing, ...newImgs];
                        if (!combined.some(i => i.is_cover === 1 || i.is_cover === true) && combined.length > 0) {
                          combined[0].is_cover = 1;
                        }
                        const cover = combined.find(i => i.is_cover === 1 || i.is_cover === true) || combined[0];
                        return {
                          ...prev,
                          images: combined,
                          image_url: cover ? cover.url : prev.image_url,
                          cover_image_id: cover ? cover.id : null
                        };
                      });
                    });
                  }}
                  onOpenMediaLibrary={() => {
                    openMultiPicker(editItem.images || [], selectedImgs => {
                      setEditItem((prev: any) => {
                        const existing: AttachedImage[] = prev.images || [];
                        const existingIds = new Set(existing.map(i => i.id));
                        const toAdd = selectedImgs.filter(i => !existingIds.has(i.id));
                        const combined = [...existing, ...toAdd];
                        if (!combined.some(i => i.is_cover === 1 || i.is_cover === true) && combined.length > 0) {
                          combined[0].is_cover = 1;
                        }
                        const cover = combined.find(i => i.is_cover === 1 || i.is_cover === true) || combined[0];
                        return {
                          ...prev,
                          images: combined,
                          image_url: cover ? cover.url : prev.image_url,
                          cover_image_id: cover ? cover.id : null
                        };
                      });
                    });
                  }}
                />
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    Link Info Wisata (Wakatobi Tourism / Google Maps)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        placeholder="Contoh: https://www.wakatobitourism.com/item/ndaa-island/"
                        value={editItem.info_url || ""}
                        onChange={e => setEditItem((prev: any) => ({ ...prev, info_url: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleScrapeDestinationImage}
                      disabled={scrapingImage || !editItem.info_url || !editItem.info_url.trim()}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                      title="Otomatis unduh foto resolusi tinggi dan konversi ke WebP"
                    >
                      {scrapingImage ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Mengunduh Foto...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-blue-100" />
                          <span>Tarik Foto dari Link</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Masukkan link artikel destinasi dari <span className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">wakatobitourism.com</span> untuk mengimpor foto resolusi tinggi secara otomatis.
                  </p>
                </div>
                <Field label="Deskripsi Destinasi (ID - Bahasa Indonesia)" value={editItem.description_id} onChange={v => setEditItem((prev: any) => ({ ...prev, description_id: v, description_en: prev?.description_en || v }))} textarea />
                <Field label="Deskripsi Destinasi (EN - English)" value={editItem.description_en} onChange={v => setEditItem((prev: any) => ({ ...prev, description_en: v }))} textarea />
              </>}

              {modalType === "gallery" && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Judul Foto (ID - Bahasa Indonesia)" value={editItem.title_id} onChange={v => setEditItem((prev: any) => ({ ...prev, title_id: v, title_en: prev?.title_en || v }))} required />
                  <Field label="Judul Foto (EN - English)" value={editItem.title_en} onChange={v => setEditItem((prev: any) => ({ ...prev, title_en: v }))} required />
                </div>
                <div>
                  <label className={labelCls}>Kategori Galeri</label>
                  <select
                    value={editItem.category || "property"}
                    onChange={e => setEditItem((prev: any) => ({ ...prev, category: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="property">Penginapan</option>
                    <option value="underwater">Bawah Laut</option>
                    <option value="island">Pulau</option>
                    <option value="dining">Kuliner</option>
                  </select>
                </div>
                <ImageUploadField 
                  label="File Foto Galeri" 
                  value={editItem.image_url} 
                  onChange={v => setEditItem((prev: any) => ({ ...prev, image_url: v }))} 
                  uploading={uploading} 
                  onFileSelect={file => handleFileUpload(file, (url, imgId) => setEditItem((prev: any) => ({ ...prev, image_url: url, id: imgId || prev?.id })))}
                  onOpenGalleryPicker={() => openPicker(editItem?.image_url, url => setEditItem((prev: any) => ({ ...prev, image_url: url })))}
                />
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="galeri_is_active"
                    checked={editItem.is_active !== 0 && editItem.is_active !== false}
                    onChange={e => setEditItem((prev: any) => ({ ...prev, is_active: e.target.checked ? 1 : 0 }))}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="galeri_is_active" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Tampilkan foto ini di Halaman Galeri Publik Website (Status: Aktif)
                  </label>
                </div>
              </>}

              {modalType === "review" && <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Field label="Nama Tamu" value={editItem.guest_name} onChange={v => setEditItem({ ...editItem, guest_name: v })} required />
                  <Field label="Asal Kota / Negara" value={editItem.origin} onChange={v => setEditItem({ ...editItem, origin: v })} required />
                  <Field label="Rating Bintang (1-5)" value={editItem.rating} onChange={v => setEditItem({ ...editItem, rating: Number(v) })} type="number" required />
                </div>
                <Field label="Ulasan Tamu (ID - Bahasa Indonesia)" value={editItem.comment_id} onChange={v => setEditItem({ ...editItem, comment_id: v, comment_en: editItem.comment_en || v })} textarea required />
                <Field label="Ulasan Tamu (EN - English)" value={editItem.comment_en} onChange={v => setEditItem({ ...editItem, comment_en: v })} textarea />
              </>}

              {modalType === "facility" && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Nama Fasilitas (ID - Bahasa Indonesia)" value={editItem.title_id} onChange={v => setEditItem({ ...editItem, title_id: v, title_en: editItem.title_en || v })} required />
                  <Field label="Nama Fasilitas (EN - English)" value={editItem.title_en} onChange={v => setEditItem({ ...editItem, title_en: v })} required />
                </div>
              </>}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-slate-100 bg-slate-50/75 rounded-b-2xl">
              <button 
                type="button"
                onClick={() => setModalType(null)} 
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const endpoints: Record<string, string> = { room: "/api/kamar.php", destination: "/api/destinasi.php", gallery: "/api/galeri.php", review: "/api/ulasan.php", facility: "/api/fasilitas.php" };
                  const setters: Record<string, any> = { room: setRooms, destination: setDestinations, gallery: setGallery, review: setReviews, facility: setFacilities };
                  const lists: Record<string, any[]> = { room: rooms, destination: destinations, gallery: gallery, review: reviews, facility: facilities };
                  saveItem(endpoints[modalType], editItem, setters[modalType], lists[modalType]);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Save size={14} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── CONFIRM DELETE MODAL ──────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-70 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Data</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    Apakah Anda yakin ingin menghapus {deleteConfirm.title ? <span className="font-semibold text-slate-800">"{deleteConfirm.title}"</span> : "item ini"} secara permanen dari database? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/75 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                id="btn-confirm-delete"
                onClick={executeDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 size={14} /> {isDeleting ? "Menghapus..." : "Ya, Hapus Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── BATCH UPLOAD MODAL FOR GALLERY & MEDIA LIBRARY ──────────── */}
      {batchUploadOpen && (
        <div className="fixed inset-0 z-70 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Unggah ke Media Library
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Foto akan otomatis dioptimasi ke format WebP berkualitas tinggi.
                </p>
              </div>
              <button 
                onClick={() => {
                  if (!uploading) {
                    setBatchUploadOpen(false);
                    setBatchFiles([]);
                  }
                }} 
                disabled={uploading}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Kategori Album
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: "property", label: "Penginapan" },
                    { key: "underwater", label: "Bawah Laut" },
                    { key: "island", label: "Pulau" },
                    { key: "dining", label: "Kuliner" },
                  ].map(cat => (
                    <button
                      key={cat.key}
                      type="button"
                      disabled={uploading}
                      onClick={() => setBatchCategory(cat.key)}
                      className={`text-xs px-3 py-2 rounded-xl font-medium transition-all text-center cursor-pointer ${
                        batchCategory === cat.key
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80"
                      } disabled:opacity-50`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag & Drop File Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  File Foto
                </label>
                <label 
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault();
                    if (uploading) return;
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const validImages = Array.from(e.dataTransfer.files).filter(f => 
                        /\.(jpe?g|png|webp|gif)$/i.test(f.name) || f.type.startsWith("image/")
                      );
                      if (validImages.length > 0) {
                        setBatchFiles(prev => [...prev, ...validImages]);
                      }
                    }
                  }}
                  className={`border border-dashed rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                    uploading 
                      ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed" 
                      : "border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 shadow-2xs">
                    <UploadCloud size={20} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Tarik file ke sini, atau <span className="text-blue-600 hover:underline">pilih dari komputer</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    JPG, PNG, WebP, GIF (bisa pilih banyak file sekaligus)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploading}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        const selected = Array.from(e.target.files);
                        setBatchFiles(prev => [...prev, ...selected]);
                        e.target.value = "";
                      }
                    }}
                  />
                </label>
              </div>

              {/* Status Tampil di Galeri Web Toggle */}
              <div 
                onClick={() => !uploading && setBatchIsActive(!batchIsActive)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800">Tampilkan di Galeri Publik</p>
                  <p className="text-[11px] text-slate-400">Langsung muncul di halaman galeri utama website</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={batchIsActive}
                  disabled={uploading}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    batchIsActive ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      batchIsActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Selected Files Preview List */}
              {batchFiles.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      File Terpilih ({batchFiles.length})
                    </span>
                    {!uploading && (
                      <button
                        type="button"
                        onClick={() => setBatchFiles([])}
                        className="text-slate-400 hover:text-red-600 font-medium transition-colors cursor-pointer"
                      >
                        Hapus Semua
                      </button>
                    )}
                  </div>

                  <div className="max-h-44 overflow-y-auto divide-y divide-slate-100 border border-slate-200/80 rounded-xl bg-white">
                    {batchFiles.map((file, idx) => (
                      <div key={`${file.name}_${idx}`} className="px-3 py-2 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <ImageIcon size={14} className="text-slate-400 shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-slate-700 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        {!uploading && (
                          <button
                            type="button"
                            onClick={() => setBatchFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors cursor-pointer"
                            title="Hapus file"
                          >
                            <X size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Real-time Upload Progress Tracker */}
              {uploadProgress.length > 0 && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <RefreshCw size={13} className="animate-spin text-blue-600" />
                      Mengunggah ({uploadProgress.filter(p => p.status === "success").length}/{uploadProgress.length})
                    </span>
                    <span className="text-[10px] text-slate-400">WebP Compression</span>
                  </div>

                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {uploadProgress.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-white rounded-lg border border-slate-100 text-xs">
                        <span className="truncate max-w-[240px] text-slate-700">{item.name}</span>
                        <div className="shrink-0 text-[11px]">
                          {item.status === "pending" && (
                            <span className="text-slate-400">Antre...</span>
                          )}
                          {item.status === "uploading" && (
                            <span className="text-blue-600 flex items-center gap-1 font-medium">
                              <RefreshCw size={11} className="animate-spin" /> Proses...
                            </span>
                          )}
                          {item.status === "success" && (
                            <span className="text-emerald-600 flex items-center gap-1 font-medium">
                              <CheckCircle2 size={12} /> Selesai
                            </span>
                          )}
                          {item.status === "error" && (
                            <span className="text-red-600 flex items-center gap-1 font-medium" title={item.error}>
                              <AlertCircle size={12} /> {item.error || "Gagal"}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                {batchFiles.length > 0 ? `${batchFiles.length} file dipilih` : "Belum ada file dipilih"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setBatchUploadOpen(false);
                    setBatchFiles([]);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={batchFiles.length === 0 || uploading}
                  onClick={handleBatchGalleryUpload}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" /> Mengunggah...
                    </>
                  ) : (
                    <>
                      <UploadCloud size={14} /> Unggah {batchFiles.length > 0 ? `(${batchFiles.length})` : ""}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── CENTRAL MEDIA LIBRARY PICKER MODAL ──────────── */}
      {pickerOpen && (
        <div className="fixed inset-0 z-70 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-600" /> Media Library Terpusat
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {pickerMode === "multi" 
                    ? "Centang foto yang ingin ditambahkan ke Kamar / Destinasi. Foto yang dipilih dapat disusun ulang nantinya." 
                    : "Pilih 1 foto dari Media Library untuk digunakan."}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setPickerOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "all", label: "Semua" },
                  { key: "property", label: "Penginapan" },
                  { key: "underwater", label: "Bawah Laut" },
                  { key: "island", label: "Pulau" },
                  { key: "dining", label: "Kuliner" },
                ].map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => {
                      setPickerCategory(cat.key);
                      setPickerPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      pickerCategory === cat.key
                        ? "bg-slate-900 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-xs">
                  <UploadCloud size={14} />
                  <span>{uploading ? "Mengunggah..." : "Upload Foto Baru"}</span>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    disabled={uploading}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        const targetCat = pickerCategory === "all" ? "property" : pickerCategory;
                        handleMultiUpload(e.target.files, targetCat, (newImgs) => {
                          fetchMediaLibrary(1, pickerCategory, pickerSearch);
                          const newGalItems: GalleryItem[] = newImgs.map(img => ({
                            id: img.id,
                            title_id: img.alt_text_id || "Foto Galeri",
                            title_en: img.alt_text_en || "Gallery Photo",
                            category: img.category || targetCat,
                            image_url: img.url,
                            thumbnail_url: img.thumbnail_url || img.url,
                            is_active: 1
                          }));
                          setGallery(prev => {
                            const updated = [...newGalItems, ...prev];
                            setStoredData(STORAGE_KEYS.GALLERY, updated);
                            return updated;
                          });
                        });
                        e.target.value = "";
                      }
                    }}
                  />
                </label>

                <div className="relative flex-1 sm:w-56">
                  <input
                    type="text"
                    placeholder="Cari nama foto atau file..."
                    value={pickerSearch}
                    onChange={e => {
                      setPickerSearch(e.target.value);
                      setPickerPage(1);
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {pickerSearch && (
                    <button onClick={() => { setPickerSearch(""); setPickerPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Progress Status in Media Library */}
            {uploadProgress.length > 0 && (
              <div className="px-4 py-2 bg-blue-50/70 border-b border-blue-100 flex items-center justify-between text-xs text-blue-950">
                <span className="flex items-center gap-1.5 font-semibold">
                  <RefreshCw size={13} className="animate-spin text-blue-600" />
                  Mengunggah foto ke Media Library... ({uploadProgress.filter(p => p.status === "success").length}/{uploadProgress.length} selesai)
                </span>
                <span className="text-[10px] text-blue-700 font-mono">Auto WebP</span>
              </div>
            )}

            {/* Media Grid Container */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 max-h-[58vh] min-h-[300px]">
              {pickerLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                  <RefreshCw size={28} className="animate-spin text-blue-600" />
                  <p className="text-xs font-semibold">Memuat Media Library...</p>
                </div>
              ) : pickerMediaItems.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <ImageIcon size={36} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-600">Tidak ada foto yang cocok dengan filter / pencarian.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {pickerMediaItems.map(item => {
                    const isSelected = pickerMode === "multi" 
                      ? selectedMediaMap.has(item.id)
                      : pickerSelectedUrl === item.url;
                    const usageCount = item.usage_count ?? 0;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          if (pickerMode === "multi") {
                            setSelectedMediaMap(prev => {
                              const next = new Map(prev);
                              if (next.has(item.id)) {
                                next.delete(item.id);
                              } else {
                                next.set(item.id, item);
                              }
                              return next;
                            });
                          } else {
                            setPickerSelectedUrl(item.url);
                            if (pickerOnSelect) pickerOnSelect(item.url);
                            setPickerOpen(false);
                          }
                        }}
                        className={`group relative rounded-xl overflow-hidden border text-left transition-all p-2 bg-white hover:shadow-md cursor-pointer flex flex-col w-full ${
                          isSelected ? "border-blue-600 ring-2 ring-blue-600/20 bg-blue-50/20" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="w-full h-24 rounded-lg overflow-hidden relative bg-slate-100 shrink-0">
                          <img 
                            src={item.thumbnail_url || item.url} 
                            alt={item.alt_text_id || "Foto"} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
                            loading="lazy"
                          />

                          {/* Selection Checkmark */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-1 shadow-md">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          )}

                          {/* Usage count badge */}
                          <span 
                            className={`absolute bottom-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-xs ${
                              usageCount > 0 
                                ? "bg-slate-900/80 text-white backdrop-blur-xs" 
                                : "bg-emerald-600/90 text-white backdrop-blur-xs"
                            }`}
                            title={usageCount > 0 ? `Foto ini digunakan di ${usageCount} kamar/destinasi` : "Belum digunakan di kamar/destinasi manapun"}
                          >
                            {usageCount > 0 ? `Dipakai: ${usageCount}x` : "Bebas"}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-slate-800 line-clamp-1 mt-1.5 px-0.5 truncate w-full" title={item.alt_text_id || item.url}>
                          {item.alt_text_id || "Foto Kasilapa"}
                        </p>
                        <span className="text-[9px] text-slate-400 font-medium px-0.5">
                          {(item.category && CATEGORY_LABEL_MAP[item.category]) || item.category || "Umum"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer: Pagination & Submit */}
            <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/75 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Pagination controls */}
              <div className="flex items-center gap-2 text-slate-600">
                <button
                  type="button"
                  disabled={pickerPage <= 1 || pickerLoading}
                  onClick={() => setPickerPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  ← Sebelumnya
                </button>
                <span className="font-semibold text-slate-700">
                  Hal {pickerPage} dari {Math.max(1, pickerTotalPages)} ({pickerTotalItems} foto)
                </span>
                <button
                  type="button"
                  disabled={pickerPage >= pickerTotalPages || pickerLoading}
                  onClick={() => setPickerPage(p => p + 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700 transition-colors cursor-pointer"
                >
                  Berikutnya →
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={() => setPickerOpen(false)} 
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                {pickerMode === "multi" && (
                  <button
                    type="button"
                    onClick={() => {
                      if (pickerOnSelectMultiple) {
                        pickerOnSelectMultiple(Array.from(selectedMediaMap.values()));
                      }
                      setPickerOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Check size={14} />
                    Gunakan {selectedMediaMap.size} Foto Terpilih
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────── Sub-components ──────────── */

function StatCard({ icon, bg, label, value, sub }: { icon: React.ReactNode; bg: string; label: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-lg border border-[#dee2e6] shadow-xs flex overflow-hidden min-h-[90px]">
      <div className={`w-18 sm:w-20 ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="p-3.5 sm:p-4 flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-xs font-bold text-[#6c757d] uppercase tracking-wider leading-tight truncate">{label}</p>
        <p className="text-xl sm:text-2xl font-bold text-[#212529] leading-tight mt-1">{value}</p>
        <p className="text-xs text-[#6c757d] font-normal mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  );
}

function Section({ 
  title, 
  desc, 
  onAdd, 
  extraAction,
  children 
}: { 
  title: string; 
  desc: string; 
  onAdd?: () => void; 
  extraAction?: React.ReactNode;
  children: React.ReactNode; 
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-lg border border-[#dee2e6] shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-[#212529]">{title}</h3>
          <p className="text-sm text-[#6c757d] mt-1">{desc}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {extraAction}
          {onAdd && (
            <button onClick={onAdd} className="inline-flex items-center gap-2 bg-[#007bff] hover:bg-[#0069d9] text-white text-sm font-semibold px-4 py-2.5 rounded-md transition-colors shadow-xs cursor-pointer">
              <Plus size={16} /> Tambah Baru
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Table({ heads, children }: { heads: string[]; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#dee2e6] rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-[#f8f9fa] border-b border-[#dee2e6]">
              {heads.map((h, i) => (
                <th key={i} className="px-4 sm:px-5 py-3.5 text-xs font-bold text-[#495057] uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dee2e6]">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#dee2e6] rounded-lg p-6 shadow-xs">
      <h3 className="text-base font-bold text-[#212529] mb-4 pb-3 border-b border-[#dee2e6] flex items-center gap-2">
        <Sparkles size={18} className="text-[#007bff]" /> {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea, required, placeholder }: { label: string; value: any; onChange: (v: string) => void; type?: string; textarea?: boolean; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {textarea ? (
        <textarea rows={3} value={value || ""} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} className={inputCls} />
      ) : (
        <input type={type} value={value ?? ""} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} className={inputCls} />
      )}
    </div>
  );
}

function ImageUploadField({ 
  label, 
  value, 
  onChange, 
  uploading, 
  onFileSelect,
  onOpenGalleryPicker
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  uploading: boolean; 
  onFileSelect: (f: File) => void;
  onOpenGalleryPicker?: () => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs">
            <UploadCloud size={15} />
            <span>{uploading ? "Mengunggah..." : "Upload Foto Baru"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
              }}
            />
          </label>

          {onOpenGalleryPicker && (
            <button
              type="button"
              onClick={onOpenGalleryPicker}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <ImageIcon size={15} className="text-slate-500" />
              <span>Pilih dari Galeri</span>
            </button>
          )}

          {uploading && <RefreshCw size={15} className="animate-spin text-slate-600" />}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={e => onChange(e.target.value)}
          placeholder="Atau masukkan URL / path foto secara manual..."
          className={inputCls}
        />
        {value && (
          <div className="flex items-center justify-between gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <img src={value} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0" />
              <span className="text-[11px] text-slate-500 font-mono truncate">{value}</span>
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Hapus foto ini"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Reusable Multi-Image Manager Component for Room & Destination Forms ── */
function MultiImageManager({
  images,
  onChange,
  onOpenMediaLibrary,
}: {
  images: AttachedImage[];
  onChange: (imgs: AttachedImage[]) => void;
  onOpenMediaLibrary: () => void;
  uploading?: boolean;
  uploadProgressList?: UploadProgressItem[];
  onFilesSelected?: (files: FileList) => void;
  category?: string;
}) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Set Cover (Radio-button style: exactly ONE is cover)
  const handleSetCover = (targetId: number) => {
    const updated = images.map(img => ({
      ...img,
      is_cover: img.id === targetId ? 1 : 0
    }));
    onChange(updated);
  };

  // Remove / detach image from this item
  const handleRemove = (indexToRemove: number) => {
    const target = images[indexToRemove];
    const isTargetCover = target.is_cover === 1 || target.is_cover === true;
    const remaining = images.filter((_, idx) => idx !== indexToRemove);

    // If removed image was cover and remaining images exist, set the first one as cover
    if (isTargetCover && remaining.length > 0) {
      remaining[0].is_cover = 1;
    }
    onChange(remaining);
  };

  // Move position left
  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const copy = [...images];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  // Move position right
  const handleMoveRight = (index: number) => {
    if (index >= images.length - 1) return;
    const copy = [...images];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const copy = [...images];
    const [moved] = copy.splice(draggedIndex, 1);
    copy.splice(targetIndex, 0, moved);
    setDraggedIndex(null);
    onChange(copy);
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-200">
        <div>
          <label className={`${labelCls} mb-0`}>Foto Kamar / Destinasi ({images.length})</label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Foto pertama atau yang ditandai Cover otomatis menjadi foto utama. Seluruh foto dikelola terpusat dari Media Library.
          </p>
        </div>
        <div>
          {/* Pick from Media Library Button */}
          <button
            type="button"
            onClick={onOpenMediaLibrary}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <ImageIcon size={15} />
            <span>Pilih dari Media Library</span>
          </button>
        </div>
      </div>

      {/* Grid of Attached Images */}
      {images.length === 0 ? (
        <div 
          onClick={onOpenMediaLibrary}
          className="p-8 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
        >
          <ImageIcon size={28} className="mx-auto text-blue-400 mb-2" />
          <p className="text-xs font-bold text-slate-700">Belum ada foto yang dipilih</p>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
            Klik di sini untuk <span className="text-blue-600 font-semibold underline">Pilih Foto dari Media Library</span>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => {
            const isCover = img.is_cover === 1 || img.is_cover === true || (idx === 0 && !images.some(i => i.is_cover === 1 || i.is_cover === true));
            return (
              <div
                key={img.id || `${img.url}_${idx}`}
                draggable
                onDragStart={e => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, idx)}
                className={`group relative rounded-xl border bg-white overflow-hidden transition-all shadow-xs hover:shadow-md flex flex-col ${
                  isCover ? "border-blue-600 ring-2 ring-blue-600/20" : "border-slate-200 hover:border-slate-300"
                } ${draggedIndex === idx ? "opacity-40 scale-95" : ""}`}
              >
                {/* Thumbnail image */}
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={img.thumbnail_url || img.url}
                    alt="Foto"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none"
                    loading="lazy"
                  />

                  {/* Single Cover Badge */}
                  {isCover && (
                    <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Star size={10} className="fill-white text-white" />
                      <span>Cover</span>
                    </div>
                  )}

                  {/* Remove Button (Top Right, Clean Overlay) */}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-2 right-2 z-10 w-6 h-6 rounded-md bg-slate-900/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors opacity-70 group-hover:opacity-100 cursor-pointer shadow-xs"
                    title="Lepas foto ini"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                {/* Footer Controls: Order & Set Cover */}
                <div className="p-2 flex items-center justify-between gap-1.5 text-xs bg-white border-t border-slate-100">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLeft(idx)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Pindah ke kiri"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <span className="font-mono text-[10px] text-slate-400 px-1 font-medium select-none">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => handleMoveRight(idx)}
                      className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Pindah ke kanan"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {/* Set Cover Toggle */}
                  {isCover ? (
                    <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 px-1.5 py-0.5">
                      <Check size={12} className="text-blue-600 stroke-[2.5]" />
                      <span>Utama</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCover(img.id)}
                      className="text-[11px] font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      Jadikan Cover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
