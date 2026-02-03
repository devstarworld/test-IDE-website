import Navbar from '@/components/Navbar/Navbar'
import HeroSection from '@/components/HeroSection/HeroSection'
import VideoSection from '@/components/VideoSection/VideoSection'
import FeaturesSection from '@/components/FeaturesSection/FeaturesSection'
import IntegrationsSection from '@/components/IntegrationsSection/IntegrationsSection'
import CTASection from '@/components/CTASection/CTASection'
import Footer from '@/components/Footer/Footer'
import BackgroundAnimation from '@/components/BackgroundAnimation/BackgroundAnimation'

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