import { FaChartLine } from 'react-icons/fa'

export default function Hero() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative overflow-hidden bg-tp-hero text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-95"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 45%, rgba(16, 42, 90, 0.55), transparent 50%), radial-gradient(circle at 88% 35%, rgba(13, 43, 45, 0.42), transparent 48%), radial-gradient(circle at 50% 95%, rgba(37, 99, 235, 0.08), transparent 45%)',
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#102a5a]/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#0d2b2d]/30 blur-3xl" />

      <div className="container relative pt-14 pb-10 sm:pt-16 sm:pb-12 md:pt-28 md:pb-18 lg:pt-32 lg:pb-20">
        <div className="row justify-center text-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-tp-nav backdrop-blur-sm sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
              <FaChartLine className="text-tp-warning" aria-hidden />
              <span>Professional-grade trading calculator</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:mb-5 md:text-5xl lg:text-6xl">
              Smart Trading Calculator
            </h1>
            <p className="mx-auto mb-6 max-w-2xl px-1 text-sm text-tp-muted sm:text-base md:mb-10 md:text-xl">
              Calculate your profit, loss, and risk like a pro trader
            </p>
            <button
              type="button"
              onClick={scrollToCalculator}
              className="inline-flex items-center justify-center rounded-lg bg-tp-primary px-6 py-3 text-sm font-semibold text-white shadow-tp-glow transition hover:bg-tp-primary-hover hover:shadow-tp-glow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-tp-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-tp-base sm:px-8 sm:py-4 sm:text-base"
            >
              Start Calculating
            </button>
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-tp-primary/60 to-transparent opacity-90" />
    </section>
  )
}

