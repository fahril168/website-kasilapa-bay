import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import DestinationContent from "@/components/pages/DestinationContent";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kasilapahotel.com";
  const meta = dict.meta.destinations;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/destinasi`,
      languages: {
        id: `${baseUrl}/id/destinasi`,
        en: `${baseUrl}/en/destinasi`,
        "x-default": `${baseUrl}/id/destinasi`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/destinasi`,
      siteName: "Kasilapa Bay",
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/img/hero.webp`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${baseUrl}/img/hero.webp`],
    },
  };
}

export default async function DestinasiPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <DestinationContent dict={dict} lang={lang as Locale} />;
}
