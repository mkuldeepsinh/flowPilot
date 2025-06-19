import { FeaturesSection } from "@/components/ui/features-section"
import { Footer } from "@/components/ui/footer"
import { Navbar } from "@/components/ui/navbar"
import { HeroSection } from "@/components/ui/hero-section"
import { DashboardShowcase } from "@/components/ui/DashboardShowcase"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <HeroSection />
      <DashboardShowcase />
      <FeaturesSection />
      <Footer />
    </div>
  )
}