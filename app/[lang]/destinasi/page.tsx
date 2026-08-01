import { getDictionary, type Locale } from "@/lib/i18n";
import DestinationContent from "@/components/pages/DestinationContent";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function DestinasiPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <DestinationContent dict={dict} />;
}
