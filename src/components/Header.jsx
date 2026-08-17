export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-tp-hero text-white shadow-lg shadow-black/30 backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-tp-primary/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(16, 42, 90, 0.45), transparent 45%), radial-gradient(circle at 82% 35%, rgba(13, 43, 45, 0.35), transparent 42%)',
        }}
      />
      <div className="container relative">
        <div className="row items-center py-2.5 sm:py-3">
          <div className="col flex items-center gap-2">
            <span className="relative">
              <span className="absolute inset-0 rounded-lg bg-tp-primary/20 blur-md" />
              <img
                src="/trade-pilot-logo.png"
                alt="TradePilot"
                width={50}
                height={50}
                className="relative h-10 w-10 rounded-lg object-contain ring-2 ring-white/10 sm:h-[50px] sm:w-[50px]"
              />
            </span>
            <span className="text-sm font-semibold tracking-tight text-white sm:text-base">TradePilot</span>
          </div>
          <nav className="col-auto hidden items-center gap-1 text-sm text-tp-nav lg:flex" aria-label="Primary">
            <a
              href="#calculator"
              className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              Calculator
            </a>
            <a href="#risk" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">
              Risk
            </a>
            <a
              href="#features"
              className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white"
            >
              Features
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

