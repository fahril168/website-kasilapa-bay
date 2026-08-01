import { getDictionary, type Locale } from "@/lib/i18n";
import ReviewsContent from "@/components/pages/ReviewsContent";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function UlasanPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <ReviewsContent dict={dict} />;
}
