import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { CTASection } from "@/components/home/cta-section";
import { FAQSection } from "@/components/home/faq-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
