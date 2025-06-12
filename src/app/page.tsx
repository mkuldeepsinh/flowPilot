
import { FeaturesSection } from "@/components/ui/features-section"
import { Footer } from "@/components/ui/footer"
import { Navbar } from "@/components/ui/navbar"


export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar/>
      <FeaturesSection />
      <Footer/>
    </div>
  )
}