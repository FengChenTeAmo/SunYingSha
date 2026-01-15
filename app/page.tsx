import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import CareerSection from '@/components/sections/CareerSection'
import HighlightsSection from '@/components/sections/HighlightsSection'
import StatisticsSection from '@/components/sections/StatisticsSection'

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />
      <AboutSection />
      <CareerSection />
      <HighlightsSection />
      <StatisticsSection />
    </div>
  )
}
