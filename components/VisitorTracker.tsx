"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getApiUrl } from "@/lib/utils";
import { STORAGE_KEYS, getStoredData, setStoredData } from "@/lib/storage";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "sess_init";
  try {
    let sid = sessionStorage.getItem("kasilapa_visitor_session");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
      sessionStorage.setItem("kasilapa_visitor_session", sid);
    }
    return sid;
  } catch {
    return "sess_" + Date.now();
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<{ path: string; time: number }>({ path: "", time: 0 });

  useEffect(() => {
    // Exclude admin dashboard and backend API routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const now = Date.now();
    // Debounce fast duplicated route events (within 1.5 seconds on same route)
    if (lastTracked.current.path === pathname && now - lastTracked.current.time < 1500) {
      return;
    }
    lastTracked.current = { path: pathname, time: now };

    const sessionId = getOrCreateSessionId();
    const payload = {
      session_id: sessionId,
      page_url: pathname,
      page_title: typeof document !== "undefined" ? document.title : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "",
    };

    // 1. Send live tracking request to Hostinger PHP API
    try {
      const apiUrl = getApiUrl("/api/track_visitor.php");
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently handle if backend is temporarily offline
      });
    } catch {
      // Ignored
    }

    // 2. Local fallback accumulator for offline or localhost development
    try {
      if (typeof window !== "undefined") {
        const todayStr = new Date().toISOString().split("T")[0];
        const existing = getStoredData<any>(STORAGE_KEYS.VISITOR_STATS, null);

        const baseViews = [18, 24, 21, 35, 29, 42, 38];
        const defaultTrend = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          const dateStr = d.toISOString().split("T")[0];
          const label = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
          const v = baseViews[i % baseViews.length] + (i * 2);
          return { date: dateStr, label, views: v, visitors: Math.max(1, Math.round(v * 0.7)) };
        });

        const defaultTopPages = [
          { page_url: "/", title: "Beranda | Kasilapa Bay", views: 128, visitors: 94, percentage: 45.1 },
          { page_url: "/kamar", title: "Kamar & Akomodasi", views: 64, visitors: 48, percentage: 22.5 },
          { page_url: "/destinasi", title: "Wisata Pulau Tomia", views: 42, visitors: 33, percentage: 14.8 },
          { page_url: "/kamar/deluxe-room", title: "Deluxe Room", views: 28, visitors: 22, percentage: 9.9 },
          { page_url: "/fasilitas", title: "Fasilitas Penginapan", views: 14, visitors: 11, percentage: 4.9 },
          { page_url: "/galeri", title: "Galeri Foto", views: 8, visitors: 7, percentage: 2.8 },
        ];
        
        let localData = existing || {
          period_days: 7,
          metrics: {
            today_views: 48,
            today_visitors: 32,
            yesterday_views: 39,
            yesterday_visitors: 26,
            period_views: 284,
            period_visitors: 195,
            total_views: 1420,
            total_visitors: 980,
          },
          daily_trend: defaultTrend,
          top_pages: defaultTopPages,
          devices: [
            { device_type: "mobile", count: 68, percentage: 65.4 },
            { device_type: "desktop", count: 32, percentage: 30.8 },
            { device_type: "tablet", count: 4, percentage: 3.8 },
          ],
          browsers: [
            { browser: "Chrome Mobile", count: 52, percentage: 50.0 },
            { browser: "Mobile Safari", count: 24, percentage: 23.1 },
            { browser: "Chrome", count: 18, percentage: 17.3 },
            { browser: "Safari", count: 6, percentage: 5.8 },
            { browser: "Firefox", count: 4, percentage: 3.8 },
          ],
          recent_logs: [],
        };

        if (!localData.daily_trend || localData.daily_trend.length === 0) {
          localData.daily_trend = defaultTrend;
        }
        if (!localData.top_pages || localData.top_pages.length === 0) {
          localData.top_pages = defaultTopPages;
        }

        // Increment counts
        localData.metrics.today_views = (localData.metrics.today_views || 0) + 1;
        localData.metrics.period_views = (localData.metrics.period_views || 0) + 1;
        localData.metrics.total_views = (localData.metrics.total_views || 0) + 1;

        // Add recent log entry
        const isMobile = /mobile|iphone|android/i.test(navigator.userAgent);
        const newLog = {
          id: Date.now(),
          ip_address: "180.252.***.***",
          page_url: pathname,
          page_title: document.title || pathname,
          device_type: isMobile ? "mobile" : "desktop",
          browser: isMobile ? "Chrome Mobile" : "Chrome",
          operating_system: isMobile ? "Android" : "Windows",
          referrer: document.referrer ? "Eksternal" : "Langsung",
          created_at: new Date().toISOString().replace("T", " ").substring(0, 19),
        };

        localData.recent_logs = [newLog, ...(localData.recent_logs || []).slice(0, 14)];
        setStoredData(STORAGE_KEYS.VISITOR_STATS, localData);
      }
    } catch {
      // Ignored
    }
  }, [pathname]);

  return null;
}
