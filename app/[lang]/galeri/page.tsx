import { getDictionary, type Locale } from "@/lib/i18n";
import GalleryContent from "@/components/pages/GalleryContent";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function GaleriPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <GalleryContent dict={dict} />;
}
