import { FaBolt, FaShieldAlt, FaPalette } from 'react-icons/fa'

const items = [
  {
    title: 'Fast Calculation',
    body: 'Compound ROI projections update as you type—see future capital and net profit in one place.',
    icon: FaBolt,
    border: 'border-tp-warning/35 hover:border-tp-warning/55',
    glow: 'shadow-tp-glow-sm hover:shadow-tp-glow',
    iconBg: 'from-tp-warning to-amber-500',
  },
  {
    title: 'Risk Management',
    body: 'Turn account size and risk rules into concrete position sizes aligned with your stop.',
    icon: FaShieldAlt,
    border: 'border-tp-success/35 hover:border-tp-success/60',
    glow: 'shadow-tp-glow-success hover:shadow-tp-glow-success',
    iconBg: 'from-teal-600 to-tp-success',
  },
  {
    title: 'Trader Friendly UI',
    body: 'Clear labels, responsive layout, and visual hierarchy built for quick checks between trades.',
    icon: FaPalette,
    border: 'border-tp-primary/35 hover:border-tp-primary/55',
    glow: 'shadow-tp-glow-sm hover:shadow-tp-glow',
    iconBg: 'from-tp-primary to-tp-primary-light',
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/10 bg-tp-base py-10 text-white md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            'radial-gradient(circle at 0% 50%, rgba(16, 42, 90, 0.35), transparent 45%), radial-gradient(circle at 100% 30%, rgba(13, 43, 45, 0.28), transparent 40%)',
        }}
      />
      <div className="container relative">
        <div className="row justify-center text-center">
          <div className="col-12 col-lg-8">
            <span className="mb-3 inline-block rounded-lg border border-white/10 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-widest text-tp-nav ring-1 ring-tp-primary/25">
              Capabilities
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-4xl">Why traders use it</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-tp-muted md:mt-3 md:text-base">
              Everything you need for quick arithmetic around entries, exits, and risk—without spreadsheet
              clutter.
            </p>
          </div>
        </div>

        <div className="row mt-6 justify-center g-3 md:mt-12 md:g-5">
          {items.map(({ title, body, icon: Icon, border, glow, iconBg }) => (
            <div key={title} className="col-12 col-md-6 col-lg-4">
              <article
                className={`group h-full rounded-2xl border-2 bg-white/[0.04] p-4 shadow-lg backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.06] md:p-6 ${border} ${glow}`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} text-white shadow-lg transition group-hover:scale-110 group-hover:shadow-xl`}
                >
                  <Icon className="text-xl" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-tp-muted">{body}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

