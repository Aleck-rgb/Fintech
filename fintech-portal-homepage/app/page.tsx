import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesGrid } from "@/components/features-grid"
import { LatestArticles } from "@/components/latest-articles"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesGrid />
        <LatestArticles />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
