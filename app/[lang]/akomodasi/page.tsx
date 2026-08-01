import { getDictionary, type Locale } from "@/lib/i18n";
import AccommodationContent from "@/components/pages/AccommodationContent";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function AkomodasiPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <AccommodationContent dict={dict} lang={lang as Locale} />;
}
