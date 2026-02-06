import {
  Navbar,
  HeroSection,
  VideoSection,
  FeaturesSection,
  IntegrationsSection,
  CTASection,
  Footer,
  BackgroundAnimation
} from '@/components'

export default function Home() {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-[hsl(0_0%_95.3%)] font-manrope">
      <div className="min-h-screen relative">
        <BackgroundAnimation />
        <Navbar />
        <HeroSection />
        <VideoSection />
        <FeaturesSection />
        <IntegrationsSection />
        <CTASection />
        <Footer />
      </div>  
    </div>
  )
}