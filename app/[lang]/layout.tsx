import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, i18n, type Locale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kasilapahotel.com";
  const ogImageUrl = `${baseUrl}/img/hero.webp`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dict.meta.title,
      template: `%s | Kasilapa Bay`,
    },
    description: dict.meta.description,
    keywords:
      locale === "en"
        ? [
            "tomia island homestay",
            "kasilapa bay",
            "wakatobi accommodation",
            "tomia dive resort",
            "hotel in tomia island",
            "places to stay in tomia",
            "wakatobi national park hotel",
            "beachfront stay tomia",
          ]
        : [
            "penginapan tomia",
            "homestay tomia wakatobi",
            "kasilapa bay",
            "hotel pulau tomia",
            "diving tomia wakatobi",
            "tempat menginap tomia",
            "pantai hondue tomia",
            "puncak kahianga tomia",
            "akomodasi wakatobi",
            "penginapan tepi pantai tomia",
          ],
    icons: {
      icon: "/img/logo.png",
      shortcut: "/img/logo.png",
      apple: "/img/logo.png",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        id: `${baseUrl}/id`,
        en: `${baseUrl}/en`,
        "x-default": `${baseUrl}/id`,
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `${baseUrl}/${locale}`,
      siteName: "Kasilapa Bay",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Kasilapa Bay — Beachfront Homestay in Tomia, Wakatobi",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "ojjikpfMS_9aP4dNjQhkLsfjnyqN3Lu25tsBAytIv",
    },
  };
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!i18n.locales.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kasilapahotel.com";

  // Schema.org Structured Data (JSON-LD) for Hotel / LodgingBusiness
  const lodgingJsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Kasilapa Bay",
    alternateName: "Kasilapa Bay Hotel",
    description: dict.meta.description,
    url: `${baseUrl}/${locale}`,
    telephone: "+6282112345678",
    priceRange: "IDR 250.000 - IDR 300.000",
    currenciesAccepted: "IDR",
    paymentAccepted: "Cash, Bank Transfer",
    image: [
      `${baseUrl}/img/hero.webp`,
      `${baseUrl}/img/logo.png`,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Desa Kasilapa, Pulau Tomia",
      addressLocality: "Kabupaten Wakatobi",
      addressRegion: "Sulawesi Tenggara",
      postalCode: "93793",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -5.772061,
      longitude: 123.920398,
    },
    hasMap: "https://maps.google.com/?q=-5.772061,123.920398",
    sameAs: [
      "https://instagram.com/kasilapahoteltomia",
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Beachfront Access", value: true },
      { "@type": "LocationFeatureSpecification", name: "Breakfast Included", value: true },
      { "@type": "LocationFeatureSpecification", name: "Diving Tour Assistance", value: true },
      { "@type": "LocationFeatureSpecification", name: "Car & Motorbike Rental", value: true },
      { "@type": "LocationFeatureSpecification", name: "Fresh Clean Water & 24h Electricity", value: true },
    ],
    checkinTime: "14:00",
    checkoutTime: "12:00",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd) }}
      />
      <Header lang={locale} dict={dict} />
      <main className="flex-1">{children}</main>
      <Footer lang={locale} dict={dict} />
    </>
  );
}
