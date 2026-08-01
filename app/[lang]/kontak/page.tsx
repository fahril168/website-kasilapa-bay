import { getDictionary, type Locale } from "@/lib/i18n";
import ContactContent from "@/components/pages/ContactContent";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function KontakPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return <ContactContent dict={dict} lang={lang as Locale} />;
}
