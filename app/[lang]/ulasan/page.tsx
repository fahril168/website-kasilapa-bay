import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import ReviewsContent from "@/components/pages/ReviewsContent";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kasilapahotel.com";
  const meta = dict.meta.reviews;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/ulasan`,
      languages: {
        id: `${baseUrl}/id/ulasan`,
        en: `${baseUrl}/en/ulasan`,
        "x-default": `${baseUrl}/id/ulasan`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${baseUrl}/${locale}/ulasan`,
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

export default async function UlasanPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <ReviewsContent dict={dict} lang={lang as Locale} />;
}
