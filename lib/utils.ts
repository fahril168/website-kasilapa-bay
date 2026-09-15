export const WHATSAPP_NUMBER = "6282112345678";

export function getWhatsAppUrl(message: string, numberOverride?: string): string {
  const num = (numberOverride && numberOverride.trim().length > 5) 
    ? numberOverride.replace(/[^0-9]/g, '') 
    : WHATSAPP_NUMBER;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function getApiUrl(path: string): string {
  if (
    typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `http://${window.location.hostname}:8000${cleanPath}`;
  }
  return path;
}
