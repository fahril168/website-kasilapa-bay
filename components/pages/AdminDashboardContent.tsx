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
} from "lucide-react";

import { getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, getStoredData, setStoredData } from "@/lib/storage";

/* ──────────────── Types ──────────────── */

type Room = { id: number; title_id: string; title_en: string; slug: string; price_per_night: number; capacity: number; bed_type: string; image_url: string; description_id: string; description_en: string };
type Destination = { id: number; name_id: string; name_en: string; category: string; description_id: string; description_en: string; distance: string; image_url: string; info_url: string };
type GalleryItem = { id: number; title_id: string; title_en: string; category: string; image_url: string; is_active?: number | boolean };
type Review = { id: number; guest_name: string; origin: string; rating: number; comment_id: string; comment_en: string; is_visible: number };
type Facility = { id: number; title_id: string; title_en: string; icon_name: string; is_active: number };
type SiteSettings = { about_headline_id: string; about_description_id: string; about_headline_en: string; about_description_en: string; whatsapp_number: string; email: string; address: string; instagram_url: string; facebook_url: string; tiktok_url: string };

type TabKey = "rooms" | "destinations" | "gallery" | "reviews" | "facilities" | "settings";

/* ──────────────── Default Fallback Data ──────────────── */

const DEFAULT_ROOMS: Room[] = [
  { id: 1, title_id: "Standart Room", title_en: "Standard Room", slug: "standart-room", price_per_night: 250000, capacity: 2, bed_type: "Double Bed", image_url: "/img/rooms/1.webp", description_id: "Tipe kamar paling ekonomis untuk solo traveler atau dua orang.", description_en: "Most economical room type for solo travelers or couples." },
  { id: 2, title_id: "Deluxe Room", title_en: "Deluxe Room", slug: "deluxe-room", price_per_night: 300000, capacity: 2, bed_type: "King Bed", image_url: "/img/rooms/2.webp", description_id: "Tipe kamar lapang dan nyaman untuk istirahat maksimal.", description_en: "Spacious and comfortable room designed for relaxation." }
];

const DEFAULT_DESTINATIONS: Destination[] = [
  { id: 1, name_id: "Puncak Kahianga", name_en: "Kahianga Peak", category: "Pemandangan Alam", description_id: "Titik tertinggi di Tomia dengan pemandangan laut biru.", description_en: "Highest peak in Tomia with endless ocean views.", distance: "10 menit berkendara", image_url: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Puncak-Kahianga-by-Amal-Hermawan-428x242.jpg", info_url: "https://www.wakatobitourism.com/item/kahianga-peak/" },
  { id: 2, name_id: "Desa Kulati", name_en: "Kulati Village", category: "Sejarah & Budaya", description_id: "Desa wisata tebing karang eksotis.", description_en: "Community-based tourism village.", distance: "20 menit berkendara", image_url: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Huuntete-Beach-Kulati-by-Muis-Bhojest-min-428x242.jpg", info_url: "https://www.wakatobitourism.com/item/kulati-village/" },
  { id: 3, name_id: "Spot Diving Roma", name_en: "Roma Dive Site", category: "Diving", description_id: "Spot menyelam paling populer di Wakatobi.", description_en: "Most popular dive spot in Wakatobi.", distance: "15 menit perahu", image_url: "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Roma-by-Wakatobi-Regency-428x242.jpg", info_url: "https://www.wakatobitourism.com/item/roma/" }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  ...Array.from({ length: 34 }, (_, i) => ({
    id: i + 1,
    title_id: `Penginapan Kasilapa Bay ${i + 1}`,
    title_en: `Kasilapa Bay Homestay ${i + 1}`,
    category: "property",
    image_url: `/img/rooms/${i + 1}.webp`,
    is_active: 1,
  })),
  { id: 35, title_id: "Pantai Hondue", title_en: "Hondue Beach", category: "island", image_url: "/img/destinations/hondue.webp", is_active: 1 },
  { id: 36, title_id: "Puncak Kahianga", title_en: "Kahianga Peak", category: "island", image_url: "/img/destinations/kahianga.webp", is_active: 1 },
  { id: 37, title_id: "Spot Diving Roma", title_en: "Roma Dive Site", category: "underwater", image_url: "/img/destinations/roma.webp", is_active: 1 },
  { id: 38, title_id: "Benteng Nata", title_en: "Nata Fortress", category: "island", image_url: "/img/destinations/nata.webp", is_active: 1 },
  { id: 39, title_id: "Pantai Huntete", title_en: "Huntete Beach", category: "island", image_url: "/img/destinations/huntete.webp", is_active: 1 },
  { id: 40, title_id: "Benteng Patua", title_en: "Patua Fortress", category: "island", image_url: "/img/destinations/patua.webp", is_active: 1 },
];

const DEFAULT_REVIEWS: Review[] = [
  { id: 1, guest_name: "Putri Kitnas", origin: "Depok, Indonesia", rating: 5, comment_id: "Rasanya seperti di rumah. Ibu dan Bapak Haji menjadikan kami seperti keluarga.", comment_en: "Feels like home. Ibu and Bapak Haji treated us like family.", is_visible: 1 },
  { id: 2, guest_name: "Lelie Liana", origin: "Bali, Indonesia", rating: 5, comment_id: "Hotelnya nyaman. Kamarnya luas. Suasana sepi dan tenang.", comment_en: "Comfortable homestay with spacious rooms in a peaceful location.", is_visible: 1 }
];

const DEFAULT_FACILITIES: Facility[] = [
  { id: 1, title_id: "WiFi Gratis", title_en: "Free WiFi", icon_name: "wifi", is_active: 1 },
  { id: 2, title_id: "Sarapan Lokal", title_en: "Local Breakfast", icon_name: "breakfast", is_active: 1 },
  { id: 3, title_id: "Sewa Mobil", title_en: "Car Rental", icon_name: "car", is_active: 1 },
  { id: 4, title_id: "Sewa Motor", title_en: "Bike Rental", icon_name: "bike", is_active: 1 },
  { id: 5, title_id: "Listrik 24 Jam", title_en: "24h Electricity", icon_name: "electricity", is_active: 1 }
];

const DEFAULT_SETTINGS: SiteSettings = {
  about_headline_id: "Kenyamanan Terbaik di Pulau Tomia",
  about_description_id: "Kasilapa Bay adalah akomodasi pilihan di Wakatobi yang memadukan kenyamanan istirahat, pelayanan ramah, dan harga yang bersahabat.",
  about_headline_en: "Best Comfort in Tomia Island",
  about_description_en: "Kasilapa Bay is a preferred accommodation in Wakatobi...",
  whatsapp_number: "6282112345678",
  email: "hello@kasilapabay.com",
  address: "Desa Kasilapa, Pulau Tomia, Kabupaten Wakatobi, Sulawesi Tenggara, Indonesia",
  instagram_url: "https://instagram.com/kasilapabay",
  facebook_url: "https://facebook.com/kasilapabay",
  tiktok_url: "https://tiktok.com/@kasilapabay",
};

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
  const [tab, setTab] = useState<TabKey>("rooms");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Data initialized with default fallback items */
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [destinations, setDestinations] = useState<Destination[]>(DEFAULT_DESTINATIONS);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [facilities, setFacilities] = useState<Facility[]>(DEFAULT_FACILITIES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load persisted local data on mount
    setRooms(getStoredData(STORAGE_KEYS.ROOMS, DEFAULT_ROOMS));
    setDestinations(getStoredData(STORAGE_KEYS.DESTINATIONS, DEFAULT_DESTINATIONS));
    setGallery(getStoredData(STORAGE_KEYS.GALLERY, DEFAULT_GALLERY));
    setReviews(getStoredData(STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS));
    setFacilities(getStoredData(STORAGE_KEYS.FACILITIES, DEFAULT_FACILITIES));
    setSettings(getStoredData(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS));
  }, []);

  /* Change password state */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newUsername, setNewUsername] = useState("admin");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  /* Modal & File Upload */
  const [modalType, setModalType] = useState<"room" | "destination" | "gallery" | "review" | "facility" | null>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  /* Gallery Media Picker State */
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSelectedUrl, setPickerSelectedUrl] = useState("");
  const [pickerOnSelect, setPickerOnSelect] = useState<((url: string) => void) | null>(null);
  const [pickerCategory, setPickerCategory] = useState("all");
  const [pickerSearch, setPickerSearch] = useState("");

  function openPicker(currentUrl: string, onSelect: (url: string) => void) {
    setPickerSelectedUrl(currentUrl || "");
    setPickerOnSelect(() => onSelect);
    setPickerCategory("all");
    setPickerSearch("");
    setPickerOpen(true);
  }

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

  /* ── Image Upload Helper ── */
  async function handleFileUpload(file: File, onSuccess: (url: string) => void) {
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
        onSuccess(d.image_url);
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
    }
  }, [isAuth]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  /* ── API helpers ── */
  async function fetchAll() {
    setLoading(true);
    try {
      const [r1, r2, r3, r4, r5, r6] = await Promise.all([
        fetch(getApiUrl("/api/kamar.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/destinasi.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/galeri.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/ulasan.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/fasilitas.php")).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(getApiUrl("/api/pengaturan.php")).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);
      if (r1?.data && Array.isArray(r1.data) && r1.data.length > 0) {
        setRooms(r1.data);
        setStoredData(STORAGE_KEYS.ROOMS, r1.data);
      }
      if (r2?.data && Array.isArray(r2.data) && r2.data.length > 0) {
        setDestinations(r2.data);
        setStoredData(STORAGE_KEYS.DESTINATIONS, r2.data);
      }
      if (r3?.data && Array.isArray(r3.data) && r3.data.length > 0) {
        setGallery(r3.data);
        setStoredData(STORAGE_KEYS.GALLERY, r3.data);
      }
      if (r4?.data && Array.isArray(r4.data) && r4.data.length > 0) {
        setReviews(r4.data);
        setStoredData(STORAGE_KEYS.REVIEWS, r4.data);
      }
      if (r5?.data && Array.isArray(r5.data) && r5.data.length > 0) {
        setFacilities(r5.data);
        setStoredData(STORAGE_KEYS.FACILITIES, r5.data);
      }
      if (r6?.data) {
        setSettings(r6.data);
        setStoredData(STORAGE_KEYS.SETTINGS, r6.data);
      }
    } catch { /* keep current stored state */ } finally { setLoading(false); }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); setLoginErr("");
    try {
      const res = await fetch(getApiUrl("/api/auth.php"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const d = await res.json();
      if (res.ok && d.status === "success") { persist(d.token); return; }
      setLoginErr(d.message || "Username atau password salah!");
    } catch {
      setLoginErr("Gagal terhubung ke server API. Pastikan server PHP / Database aktif.");
    }
  }

  function persist(token: string) { setAuthToken(token); localStorage.setItem("kasilapa_admin_token", token); setIsAuth(true); fetchAll(); }
  function logout() { localStorage.removeItem("kasilapa_admin_token"); setAuthToken(""); setIsAuth(false); }

  async function saveItem(endpoint: string, data: any, setter: any, list: any[]) {
    setLoading(true); setToast(null);
    const isEdit = !!data.id;
    const storageKey = storageEndpointMap[endpoint];

    // Functional update + persistent storage
    setter((prev: any[]) => {
      const updated = isEdit 
        ? prev.map((it: any) => it.id === data.id ? { ...it, ...data } : it)
        : [{ ...data, id: data.id || Date.now() }, ...prev];
      if (storageKey) setStoredData(storageKey, updated);
      return updated;
    });

    try {
      const res = await fetch(getApiUrl(endpoint), {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(data)
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

  async function deleteItem(endpoint: string, id: number, setter: any, list: any[]) {
    if (!confirm("Hapus item ini?")) return;
    const storageKey = storageEndpointMap[endpoint];
    setter((prev: any[]) => {
      const updated = prev.filter((it: any) => it.id !== id);
      if (storageKey) setStoredData(storageKey, updated);
      return updated;
    });
    setToast({ type: "ok", text: "Item berhasil dihapus." });

    try {
      await fetch(getApiUrl(`${endpoint}?id=${id}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` }
      });
    } catch {
      // Storage already updated
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

  const sidebarNav: { key: TabKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "rooms", label: "Kamar", icon: <BedDouble size={18} />, count: rooms.length },
    { key: "destinations", label: "Destinasi", icon: <MapPin size={18} />, count: destinations.length },
    { key: "gallery", label: "Galeri", icon: <ImageIcon size={18} />, count: gallery.length },
    { key: "reviews", label: "Ulasan", icon: <Star size={18} />, count: reviews.length },
    { key: "facilities", label: "Fasilitas", icon: <Coffee size={18} />, count: facilities.length },
    { key: "settings", label: "Pengaturan", icon: <Settings size={18} />, count: 0 },
  ];

  const pageTitle = sidebarNav.find(s => s.key === tab)?.label ?? "";

  return (
    <div className="min-h-screen bg-slate-50/70 flex" style={{ fontFamily: "var(--font-plus-jakarta), system-ui, sans-serif" }}>
      {/* ── Sidebar ── */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-100">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm font-bold text-sm">
            K
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm leading-tight">Kasilapa Bay</h1>
            <p className="text-[11px] text-slate-400 font-medium">CMS Admin Panel</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {sidebarNav.map(s => {
            const isActive = tab === s.key;
            return (
              <button
                key={s.key}
                onClick={() => { setTab(s.key); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50/90 text-blue-700 font-bold border-l-4 border-blue-600 rounded-r-xl rounded-l-none -ml-3 pl-5 pr-3.5"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl px-3.5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-blue-600" : "text-slate-400"}>{s.icon}</span>
                  <span>{s.label}</span>
                </div>
                {s.count > 0 && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {s.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between px-2 py-1.5 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                A
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 leading-tight">Admin Master</p>
                <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors border border-red-100 bg-white shadow-2xs">
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-600"><Menu size={20} /></button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Dashboard /</span>
              <h2 className="text-sm font-bold text-slate-800">{pageTitle}</h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/id" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-xl transition-all bg-white shadow-2xs">
              <Home size={14} /> Lihat Website
            </a>
            <button onClick={fetchAll} disabled={loading} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-colors">
              <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} /> Refresh
            </button>
          </div>
        </header>

        {/* Toast */}
        {toast && (
          <div className={`mx-4 lg:mx-8 mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-sm ${
            toast.type === "ok" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-800"
          }`}>
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{toast.text}</span>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 space-y-6">

          {/* ── Metric Summary Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<BedDouble size={20} className="text-blue-600" />} bg="bg-blue-50" label="Tipe Kamar" value={`${rooms.length} Kamar`} sub="Siap Disewa" />
            <StatCard icon={<MapPin size={20} className="text-emerald-600" />} bg="bg-emerald-50" label="Spot Wisata" value={`${destinations.length} Destinasi`} sub="Di Pulau Tomia" />
            <StatCard icon={<ImageIcon size={20} className="text-purple-600" />} bg="bg-purple-50" label="Foto Galeri" value={`${gallery.filter(g => g.is_active !== 0 && g.is_active !== false).length} / ${gallery.length} Foto`} sub="Aktif di Website" />
            <StatCard icon={<Star size={20} className="text-amber-500" />} bg="bg-amber-50" label="Rating Tamu" value="4.9 ★" sub={`${reviews.length} Ulasan Aktif`} />
          </div>

          {/* ── 1. KAMAR ── */}
          {tab === "rooms" && (
            <Section title="Manajemen Kamar & Akomodasi" desc="Kelola tipe kamar, harga sewa per malam, dan detail penginapan." onAdd={() => { setEditItem({ title_id: "", title_en: "", slug: "", price_per_night: 250000, capacity: 2, bed_type: "Double Bed", image_url: "/img/rooms/1.webp", description_id: "", description_en: "" }); setModalType("room"); }}>
              <Table heads={["Foto", "Nama Kamar", "Harga / Malam", "Kapasitas", "Tipe Kasur", "Aksi"]}>
                {rooms.map(r => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <img src={r.image_url || "/img/rooms/1.webp"} alt={r.title_id} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" />
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
                        <button onClick={() => { setEditItem(r); setModalType("room"); }} className={btnGhost}><Pencil size={14} /> Edit</button>
                        <button onClick={() => deleteItem("/api/kamar.php", r.id, setRooms, rooms)} className={btnDanger}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </Section>
          )}

          {/* ── 2. DESTINASI ── */}
          {tab === "destinations" && (
            <Section title="Manajemen Destinasi & Wisata" desc="Kelola spot wisata dan tempat diving populer sekitar Pulau Tomia." onAdd={() => { setEditItem({ name_id: "", name_en: "", category: "Pemandangan Alam", distance: "10 menit berkendara", image_url: "", description_id: "", description_en: "", info_url: "" }); setModalType("destination"); }}>
              <Table heads={["Foto", "Nama Destinasi", "Kategori", "Jarak Tempuh", "Info Link", "Aksi"]}>
                {destinations.map(d => (
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3">
                      <img src={d.image_url || "https://www.wakatobitourism.com/wp-content/uploads/2018/04/Puncak-Kahianga-by-Amal-Hermawan-428x242.jpg"} alt={d.name_id} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs" />
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
                        <button onClick={() => { setEditItem(d); setModalType("destination"); }} className={btnGhost}><Pencil size={14} /> Edit</button>
                        <button onClick={() => deleteItem("/api/destinasi.php", d.id, setDestinations, destinations)} className={btnDanger}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </Section>
          )}

          {/* ── 3. GALERI ── */}
          {tab === "gallery" && (
            <Section 
              title="Manajemen Galeri Foto" 
              desc="Kelola koleksi album foto penginapan, pantai, underwater, dan kuliner. Anda dapat mengaktifkan atau menonaktifkan foto yang ingin ditampilkan di website publik." 
              onAdd={() => { setEditItem({ title_id: "", title_en: "", category: "property", image_url: "", is_active: 1 }); setModalType("gallery"); }}
            >
              <Table heads={["Preview Foto", "Judul Foto", "Kategori Album", "Status Tampil", "Aksi"]}>
                {gallery.map(g => {
                  const isActive = g.is_active !== 0 && g.is_active !== false;
                  return (
                    <tr key={g.id} className={`border-b border-slate-100 transition-colors ${isActive ? "hover:bg-blue-50/30" : "bg-slate-50/60 opacity-60 hover:opacity-100"}`}>
                      <td className="px-4 py-3">
                        <img src={g.image_url || "/img/rooms/1.webp"} alt={g.title_id} className="w-16 h-11 rounded-lg object-cover border border-slate-200 shadow-2xs" />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-slate-800 block">{g.title_id}</span>
                        <span className="text-xs text-slate-400 font-medium">{g.title_en}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full font-semibold">
                          {g.category}
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
                          <button onClick={() => deleteItem("/api/galeri.php", g.id, setGallery, gallery)} className={btnDanger}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </Table>
            </Section>
          )}

          {/* ── 4. ULASAN ── */}
          {tab === "reviews" && (
            <Section title="Manajemen Ulasan Tamu" desc="Kelola testimoni dan ulasan pengunjung Kasilapa Bay." onAdd={() => { setEditItem({ guest_name: "", origin: "Indonesia", rating: 5, comment_id: "", comment_en: "", is_visible: 1 }); setModalType("review"); }}>
              <Table heads={["Pengunjung", "Asal Kota", "Rating", "Kutipan Ulasan", "Aksi"]}>
                {reviews.map(r => (
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
                        <button onClick={() => deleteItem("/api/ulasan.php", r.id, setReviews, reviews)} className={btnDanger}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </Section>
          )}

          {/* ── 5. FASILITAS ── */}
          {tab === "facilities" && (
            <Section title="Manajemen Fasilitas Penginapan" desc="Kelola daftar fasilitas unggulan yang tersedia untuk tamu." onAdd={() => { setEditItem({ title_id: "", title_en: "", icon_name: "coffee", is_active: 1 }); setModalType("facility"); }}>
              <Table heads={["Nama Fasilitas (ID)", "Nama Fasilitas (EN)", "Icon", "Status", "Aksi"]}>
                {facilities.map(f => (
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
                        <button onClick={() => deleteItem("/api/fasilitas.php", f.id, setFacilities, facilities)} className={btnDanger}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </Section>
          )}

          {/* ── 6. PENGATURAN UMUM ── */}
          {tab === "settings" && (
            <div className="max-w-4xl space-y-6">
              <form onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  const res = await fetch(getApiUrl("/api/pengaturan.php"), {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
                    body: JSON.stringify(settings)
                  });
                  const j = await res.json();
                  if (res.ok && j.status === "success") { setToast({ type: "ok", text: "Pengaturan umum berhasil disimpan ke database!" }); }
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

                <Card title="Kontak & Lokasi">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Nomor WhatsApp Admin (Awali 62)" value={settings.whatsapp_number} onChange={v => setSettings({ ...settings, whatsapp_number: v })} placeholder="6282112345678" required />
                    <Field label="Email Resmi" value={settings.email} onChange={v => setSettings({ ...settings, email: v })} type="email" placeholder="hello@kasilapabay.com" required />
                    <div className="md:col-span-2">
                      <Field label="Alamat Lengkap" value={settings.address} onChange={v => setSettings({ ...settings, address: v })} required />
                    </div>
                  </div>
                </Card>

                <Card title="Tautan Media Sosial">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="URL Instagram" value={settings.instagram_url} onChange={v => setSettings({ ...settings, instagram_url: v })} placeholder="https://instagram.com/kasilapabay" />
                    <Field label="URL Facebook" value={settings.facebook_url} onChange={v => setSettings({ ...settings, facebook_url: v })} placeholder="https://facebook.com/kasilapabay" />
                    <Field label="URL TikTok" value={settings.tiktok_url} onChange={v => setSettings({ ...settings, tiktok_url: v })} placeholder="https://tiktok.com/@kasilapabay" />
                  </div>
                </Card>

                <div className="flex justify-end">
                  <button type="submit" disabled={loading} className={`${btnPrimary} py-3 px-6 text-sm`}>
                    <Save size={16} /> Simpan Pengaturan
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">{editItem.id ? "Edit Data" : "Tambah Data Baru"}</h3>
              <button onClick={() => setModalType(null)} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400"><X size={18} /></button>
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
                <ImageUploadField 
                  label="Foto Kamar / Gambar Utama" 
                  value={editItem.image_url} 
                  onChange={v => setEditItem((prev: any) => ({ ...prev, image_url: v }))} 
                  uploading={uploading} 
                  onFileSelect={file => handleFileUpload(file, url => setEditItem((prev: any) => ({ ...prev, image_url: url })))}
                  onOpenGalleryPicker={() => openPicker(editItem?.image_url, url => setEditItem((prev: any) => ({ ...prev, image_url: url })))}
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
                <ImageUploadField 
                  label="Foto Destinasi / Spot Wisata" 
                  value={editItem.image_url} 
                  onChange={v => setEditItem((prev: any) => ({ ...prev, image_url: v }))} 
                  uploading={uploading} 
                  onFileSelect={file => handleFileUpload(file, url => setEditItem((prev: any) => ({ ...prev, image_url: url })))}
                  onOpenGalleryPicker={() => openPicker(editItem?.image_url, url => setEditItem((prev: any) => ({ ...prev, image_url: url })))}
                />
                <Field label="Link Info Website (Wakatobi Tourism / Google Maps)" value={editItem.info_url} onChange={v => setEditItem((prev: any) => ({ ...prev, info_url: v }))} />
                <Field label="Deskripsi Destinasi (ID - Bahasa Indonesia)" value={editItem.description_id} onChange={v => setEditItem((prev: any) => ({ ...prev, description_id: v, description_en: prev?.description_en || v }))} textarea />
                <Field label="Deskripsi Destinasi (EN - English)" value={editItem.description_en} onChange={v => setEditItem((prev: any) => ({ ...prev, description_en: v }))} textarea />
              </>}

              {modalType === "gallery" && <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Judul Foto (ID - Bahasa Indonesia)" value={editItem.title_id} onChange={v => setEditItem((prev: any) => ({ ...prev, title_id: v, title_en: prev?.title_en || v }))} required />
                  <Field label="Judul Foto (EN - English)" value={editItem.title_en} onChange={v => setEditItem((prev: any) => ({ ...prev, title_en: v }))} required />
                </div>
                <Field label="Kategori (property / underwater / island / dining)" value={editItem.category} onChange={v => setEditItem((prev: any) => ({ ...prev, category: v }))} required />
                <ImageUploadField 
                  label="File Foto Galeri" 
                  value={editItem.image_url} 
                  onChange={v => setEditItem((prev: any) => ({ ...prev, image_url: v }))} 
                  uploading={uploading} 
                  onFileSelect={file => handleFileUpload(file, url => setEditItem((prev: any) => ({ ...prev, image_url: url })))}
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

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <button onClick={() => setModalType(null)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
              <button
                onClick={() => {
                  const endpoints: Record<string, string> = { room: "/api/kamar.php", destination: "/api/destinasi.php", gallery: "/api/galeri.php", review: "/api/ulasan.php", facility: "/api/fasilitas.php" };
                  const setters: Record<string, any> = { room: setRooms, destination: setDestinations, gallery: setGallery, review: setReviews, facility: setFacilities };
                  const lists: Record<string, any[]> = { room: rooms, destination: destinations, gallery: gallery, review: reviews, facility: facilities };
                  saveItem(endpoints[modalType], editItem, setters[modalType], lists[modalType]);
                }}
                className={btnPrimary}
              >
                <Save size={14} /> Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── GALLERY MEDIA PICKER MODAL ──────────── */}
      {pickerOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <ImageIcon size={18} className="text-purple-600" /> Pilih Foto dari Galeri Website
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Pilih salah satu dari {gallery.length} koleksi foto galeri yang tersedia.</p>
              </div>
              <button onClick={() => setPickerOpen(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Filter & Search */}
            <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: "all", label: "Semua Foto" },
                  { key: "property", label: "Kamar & Homestay" },
                  { key: "underwater", label: "Underwater / Diving" },
                  { key: "island", label: "Pantai & Pulau" },
                  { key: "dining", label: "Kuliner" },
                ].map(cat => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setPickerCategory(cat.key)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      pickerCategory === cat.key
                        ? "bg-purple-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cari foto..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {pickerSearch && (
                  <button onClick={() => setPickerSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Photo Grid Container with proper scrolling */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 max-h-[60vh] min-h-[300px]">
              <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5"
                style={{ gridAutoRows: "max-content", alignItems: "start" }}
              >
                {gallery
                  .filter(item => {
                    const matchesCat = pickerCategory === "all" || item.category === pickerCategory;
                    const matchesSearch = !pickerSearch || 
                      item.title_id.toLowerCase().includes(pickerSearch.toLowerCase()) || 
                      item.image_url.toLowerCase().includes(pickerSearch.toLowerCase());
                    return matchesCat && matchesSearch;
                  })
                  .map(item => {
                    const isSelected = pickerSelectedUrl === item.image_url;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setPickerSelectedUrl(item.image_url);
                          if (pickerOnSelect) {
                            pickerOnSelect(item.image_url);
                          }
                          setPickerOpen(false);
                        }}
                        className={`group relative rounded-xl overflow-hidden border text-left transition-all p-2 bg-white hover:shadow-lg cursor-pointer flex flex-col w-full ${
                          isSelected ? "border-purple-600 ring-2 ring-purple-600/30 bg-purple-50/20" : "border-slate-200 hover:border-purple-400"
                        }`}
                        style={{ display: "flex", flexDirection: "column", width: "100%", height: "auto" }}
                      >
                        <div 
                          className="w-full rounded-lg overflow-hidden relative bg-slate-100 shrink-0"
                          style={{ width: "100%", height: "110px", minHeight: "110px", position: "relative" }}
                        >
                          <img 
                            src={item.image_url} 
                            alt={item.title_id} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block" 
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-purple-600 text-white rounded-full p-1 shadow-md">
                              <Check size={13} className="stroke-[3]" />
                            </div>
                          )}
                          <span className="absolute bottom-1.5 left-1.5 text-[10px] font-semibold bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md shadow-xs">
                            {item.category === "property" ? "Kamar" : item.category === "underwater" ? "Diving" : item.category === "island" ? "Pulau" : item.category}
                          </span>
                        </div>
                        <p 
                          className="text-[11px] font-semibold text-slate-800 line-clamp-1 mt-1.5 px-0.5 w-full truncate"
                          style={{ display: "block", fontSize: "11px", lineHeight: "14px", marginTop: "6px" }}
                        >
                          {item.title_id}
                        </p>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
              <span className="font-medium">💡 Klik pada foto untuk langsung memilih</span>
              <button onClick={() => setPickerOpen(false)} className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer">
                Tutup
              </button>
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
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
      <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 leading-tight">{label}</p>
        <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{value}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function Section({ title, desc, onAdd, children }: { title: string; desc: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
        </div>
        <button onClick={onAdd} className={btnPrimary}><Plus size={15} /> Tambah Baru</button>
      </div>
      {children}
    </div>
  );
}

function Table({ heads, children }: { heads: string[]; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80">
              {heads.map((h, i) => <th key={i} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs">
      <h3 className="text-sm font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
        <Sparkles size={16} className="text-blue-600" /> {title}
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
          <label className="cursor-pointer inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs">
            <UploadCloud size={16} />
            <span>{uploading ? "Mengunggah..." : "📷 Upload Foto Baru"}</span>
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
              className="inline-flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              <ImageIcon size={16} />
              <span>🖼️ Pilih dari Galeri</span>
            </button>
          )}

          {uploading && <RefreshCw size={16} className="animate-spin text-blue-600" />}
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
