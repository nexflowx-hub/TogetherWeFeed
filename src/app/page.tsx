import { DonateProvider } from "@/components/site/donate-provider";
import { LocaleProvider } from "@/i18n/locale-provider";
import { SiteHeader } from "@/components/site/site-header";
import { Hero } from "@/components/site/hero";
import { MatchCampaign } from "@/components/site/match-campaign";
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
import { ExitIntentModal } from "@/components/site/exit-intent-modal";
import { SocialProofNotifications } from "@/components/site/social-proof-notifications";
import { TrustBadges } from "@/components/site/trust-badges";
import { JsonLd } from "@/components/site/json-ld";

export default function Home() {
  return (
    <LocaleProvider>
      <DonateProvider>
        <div id="topo" className="flex min-h-screen flex-col">
          <JsonLd />
          <SiteHeader />
          <main className="flex-1">
            <Hero />

            <div className="h-5 bg-white sm:h-6" />

            <MatchCampaign />

            <VideoSection />

            <MissionSection />

            <div className="h-6 bg-white sm:h-8" />

            <StatsSection />

            <DonateSection variant="sky" id="doar" />

            <div className="bg-sky-soft pb-10 pt-2">
              <TrustBadges />
            </div>

            <div className="h-6 bg-sky-soft sm:h-8" />

            <UrgencySection />

            <GoalSection />

            <ImpactsSection />

            <DonateSection variant="navy" id="doar-agora" />

            <div className="bg-navy-deep pb-10 pt-2">
              <TrustBadges variant="dark" />
            </div>

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
          <SocialProofNotifications />
          <CheckoutDialog />
          <ExitIntentModal />
        </div>
      </DonateProvider>
    </LocaleProvider>
  );
}
