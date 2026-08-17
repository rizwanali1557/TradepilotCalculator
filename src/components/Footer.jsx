const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-tp-hero py-7 text-center sm:py-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle at 22% 70%, rgba(16, 42, 90, 0.4), transparent 50%), radial-gradient(circle at 78% 25%, rgba(13, 43, 45, 0.32), transparent 45%)',
        }}
      />
      <div className="container relative">
        <p className="text-xs text-tp-muted sm:text-sm">© 2026 TradePilot Smart Calculator</p>
      </div>
    </footer>
  )
}
export default Footer

