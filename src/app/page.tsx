import { DonateProvider } from "@/components/site/donate-provider";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { VideoSection } from "@/components/site/video-section";
import { MissionSection } from "@/components/site/mission-section";
import { StatsSection } from "@/components/site/stats-section";
import { DonateSection } from "@/components/site/donate-section";
import { UrgencySection } from "@/components/site/urgency-section";
import { GoalSection } from "@/components/site/goal-section";
import { ImpactsSection } from "@/components/site/impacts-section";
import { StoriesCarousel } from "@/components/site/stories-carousel";
import { ContrastSection } from "@/components/site/contrast-section";
import { LiveProgress } from "@/components/site/live-progress";
import { TestimonialsCarousel } from "@/components/site/testimonials-carousel";
import { FaqSection } from "@/components/site/faq-section";
import { BannerCta } from "@/components/site/banner-cta";
import { SiteFooter } from "@/components/site/site-footer";
import { StickyDonateBar } from "@/components/site/sticky-donate-bar";
import { CheckoutDialog } from "@/components/site/checkout-dialog";

export default function Home() {
  return (
    <DonateProvider>
      <div id="topo" className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Hero />

          <div className="h-5 bg-white sm:h-6" />

          <VideoSection />

          <MissionSection />

          <div className="h-6 bg-white sm:h-8" />

          <StatsSection />

          <DonateSection variant="sky" id="doar" ctaLabel="Quero ajudar agora" />

          <div className="h-6 bg-sky-soft sm:h-8" />

          <UrgencySection />

          <GoalSection />

          <ImpactsSection />

          <DonateSection
            variant="navy"
            id="doar-agora"
            ctaLabel="Doar agora"
          />

          <div className="h-6 bg-sun sm:h-8" />

          <StoriesCarousel />

          <ContrastSection />

          <LiveProgress />

          <div className="h-6 bg-white sm:h-8" />

          <TestimonialsCarousel />

          <FaqSection />

          <div className="h-6 bg-sky-soft sm:h-8" />

          <BannerCta />

          <div className="h-6 bg-sky-soft sm:h-8" />
        </main>

        <SiteFooter />

        <StickyDonateBar />
        <CheckoutDialog />
      </div>
    </DonateProvider>
  );
}
