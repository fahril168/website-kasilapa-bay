import { getDictionary, type Locale } from "@/lib/i18n";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import FeaturedRooms from "@/components/sections/FeaturedRooms";
import FeaturedDestinations from "@/components/sections/FeaturedDestinations";
import ReviewsPreview from "@/components/sections/ReviewsPreview";
import CtaBanner from "@/components/sections/CtaBanner";

type Props = {
  params: Promise<{ lang: string }>;
};

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <HeroSection dict={dict} lang={lang as Locale} />
      <AboutSection dict={dict} />
      <FeaturedRooms dict={dict} lang={lang as Locale} />
      <FeaturedDestinations dict={dict} lang={lang as Locale} />
      <ReviewsPreview dict={dict} />
      <CtaBanner dict={dict} />
    </>
  );
}
