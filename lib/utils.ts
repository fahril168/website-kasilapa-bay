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

export function formatPhoneNumber(numStr?: string): string {
  if (!numStr) return "";
  const cleaned = numStr.replace(/[^0-9]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("62")) {
    const part1 = cleaned.slice(0, 2);
    const part2 = cleaned.slice(2, 5);
    const part3 = cleaned.slice(5, 9);
    const part4 = cleaned.slice(9);
    return `+${part1} ${part2}${part3 ? "-" + part3 : ""}${part4 ? "-" + part4 : ""}`;
  }
  if (cleaned.startsWith("0")) {
    const part1 = cleaned.slice(0, 4);
    const part2 = cleaned.slice(4, 8);
    const part3 = cleaned.slice(8);
    return `${part1}-${part2}${part3 ? "-" + part3 : ""}`;
  }
  return `+${cleaned}`;
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
