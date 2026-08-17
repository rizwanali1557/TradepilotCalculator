import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import CalculatorSection from './components/CalculatorSection.jsx'
import RiskManagementSection from './components/RiskManagementSection.jsx'
import FeaturesSection from './components/FeaturesSection.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-tp-base text-tp-nav">
      <Header />
      <main>
        <Hero />
        <CalculatorSection />
        <RiskManagementSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
