import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import VisitorTracker from "@/components/VisitorTracker";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kasilapahotel.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kasilapa Bay",
  description: "Beachfront homestay in Tomia Island, Wakatobi",
  verification: {
    google: "ojjikpfMS_9aP4dNjQhkLsfjnyqN3Lu25tsBAytIv",
  },
  icons: {
    icon: "/img/logo.png",
    shortcut: "/img/logo.png",
    apple: "/img/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${playfair.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
