import { useEffect, useMemo, useState } from 'react'
import { FaBalanceScale, FaInfoCircle } from 'react-icons/fa'

const num = (v) => {
  const n = parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : NaN
}

const RISK_PROFILE_OPTIONS = [
  { id: 'safe', label: 'Safe (0.5%)', riskPct: 0.5 },
  { id: 'balanced', label: 'Balanced (1%)', riskPct: 1 },
  { id: 'growth', label: 'Growth (2%)', riskPct: 2 },
  { id: 'custom', label: 'Custom risk %', riskPct: null, isCustom: true },
]

const STOP_PRESET_OPTIONS = [
  { id: 'fx-tight', label: 'FX tight (0.0025)', distance: 0.0025 },
  { id: 'fx-wide', label: 'FX wide (0.0050)', distance: 0.005 },
  { id: 'equity', label: 'Equity sample (2.50)', distance: 2.5 },
  { id: 'custom', label: 'Custom stop distance', distance: null, isCustom: true },
]

export default function RiskManagementSection() {
  const [balance, setBalance] = useState('')
  const [riskProfileId, setRiskProfileId] = useState('balanced')
  const [riskPct, setRiskPct] = useState('1')
  const [stopPresetId, setStopPresetId] = useState('fx-tight')
  const [stopDistance, setStopDistance] = useState('0.0025')
  const [output, setOutput] = useState(null)
  const [error, setError] = useState(null)
  const selectedRiskProfile = useMemo(
    () => RISK_PROFILE_OPTIONS.find((o) => o.id === riskProfileId) ?? RISK_PROFILE_OPTIONS[1],
    [riskProfileId],
  )
  const selectedStopPreset = useMemo(
    () => STOP_PRESET_OPTIONS.find((o) => o.id === stopPresetId) ?? STOP_PRESET_OPTIONS[0],
    [stopPresetId],
  )

  useEffect(() => {
    if (!selectedRiskProfile.isCustom && Number.isFinite(selectedRiskProfile.riskPct)) {
      setRiskPct(String(selectedRiskProfile.riskPct))
    }
  }, [selectedRiskProfile])

  useEffect(() => {
    if (!selectedStopPreset.isCustom && Number.isFinite(selectedStopPreset.distance)) {
      setStopDistance(String(selectedStopPreset.distance))
    }
  }, [selectedStopPreset])

  const handleCalculate = (e) => {
    e.preventDefault()
    const b = num(balance)
    const r = num(riskPct)
    const s = num(stopDistance)
    if (!Number.isFinite(b) || b <= 0 || !Number.isFinite(r) || r <= 0 || !Number.isFinite(s) || s <= 0) {
      setOutput(null)
      setError('Please enter valid positive values in all fields.')
      return
    }
    const riskAmount = b * (r / 100)
    const suggestedLot = riskAmount / s
    setError(null)
    setOutput({ riskAmount, suggestedLot })
  }

  return (
    <section
      id="risk"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/10 py-10 md:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 0% 100%, rgba(16, 42, 90, 0.25), transparent 50%), radial-gradient(circle at 100% 0%, rgba(13, 43, 45, 0.2), transparent 45%)',
        }}
      />
      <div className="container relative">
        <div className="row justify-center">
          <div className="col-12 col-lg-10 col-xl-8">
            <div className="mb-6 text-center md:mb-10">
              <span className="mb-3 inline-flex items-center gap-2 rounded-lg bg-tp-primary px-4 py-1.5 text-sm font-semibold text-white shadow-tp-glow-sm">
                <FaBalanceScale aria-hidden />
                Risk management
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
                Size your positions safely
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-tp-muted md:mt-3 md:text-base">
                Risk amount is based on your balance and risk percentage. Lot size uses stop distance per
                unit (price move against you per contract/share).
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-tp-surface/95 to-tp-base/95 p-4 shadow-tp-glow-sm ring-1 ring-white/5 backdrop-blur-sm transition hover:shadow-tp-glow md:p-8">
              <div className="mb-4 flex gap-3 rounded-xl border border-white/10 bg-tp-base/60 p-3 text-xs text-tp-nav sm:text-sm md:mb-6 md:p-4">
                <FaInfoCircle className="mt-0.5 shrink-0 text-lg text-tp-primary-light" aria-hidden />
                <p>
                  <strong className="text-white">Stop loss</strong> here means the absolute price distance
                  per unit to your stop (for example, 0.0050 on FX or 2.50 on equities). Suggested lot size =
                  risk amount ÷ stop distance.
                </p>
              </div>

              <form onSubmit={handleCalculate} className="row g-4">
                <div className="col-12">
                  <div className="grid gap-3 rounded-xl border border-white/10 bg-tp-base/40 p-3 ring-1 ring-white/5 md:grid-cols-2">
                    <div>
                      <label htmlFor="risk-profile" className="mb-1 block text-sm font-semibold text-tp-muted">
                        Risk profile selector
                      </label>
                      <select
                        id="risk-profile"
                        value={riskProfileId}
                        onChange={(ev) => setRiskProfileId(ev.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-white/10 bg-tp-base px-3 py-2.5 text-sm font-semibold text-white outline-none transition focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/25"
                      >
                        {RISK_PROFILE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id} className="bg-tp-surface text-tp-ink">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="stop-preset" className="mb-1 block text-sm font-semibold text-tp-muted">
                        Stop loss selector
                      </label>
                      <select
                        id="stop-preset"
                        value={stopPresetId}
                        onChange={(ev) => setStopPresetId(ev.target.value)}
                        className="w-full cursor-pointer rounded-lg border border-white/10 bg-tp-base px-3 py-2.5 text-sm font-semibold text-white outline-none transition focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/25"
                      >
                        {STOP_PRESET_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id} className="bg-tp-surface text-tp-ink">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="balance" className="mb-1 block text-sm font-semibold text-tp-muted">
                    Account Balance
                  </label>
                  <p className="mb-2 text-xs text-slate-500">Total account equity in USD.</p>
                  <input
                    id="balance"
                    type="text"
                    inputMode="decimal"
                    value={balance}
                    onChange={(ev) => setBalance(ev.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-tp-base px-4 py-3 text-white tabular-nums outline-none transition placeholder:text-slate-500 focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/25"
                    placeholder="e.g. 10000"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="risk" className="mb-1 block text-sm font-semibold text-tp-muted">
                    Risk %
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    {selectedRiskProfile.isCustom
                      ? 'Enter custom percent risk per trade.'
                      : `Auto-filled from profile: ${selectedRiskProfile.label}.`}
                  </p>
                  <input
                    id="risk"
                    type="text"
                    inputMode="decimal"
                    value={riskPct}
                    onChange={(ev) => setRiskPct(ev.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-tp-base px-4 py-3 text-white tabular-nums outline-none transition placeholder:text-slate-500 focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/25"
                    placeholder="e.g. 1"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="sl" className="mb-1 block text-sm font-semibold text-tp-muted">
                    Stop Loss (price distance / unit)
                  </label>
                  <p className="mb-2 text-xs text-slate-500">
                    {selectedStopPreset.isCustom
                      ? 'Enter your custom stop distance.'
                      : `Auto-filled from selector: ${selectedStopPreset.label}.`}
                  </p>
                  <input
                    id="sl"
                    type="text"
                    inputMode="decimal"
                    value={stopDistance}
                    onChange={(ev) => setStopDistance(ev.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-tp-base px-4 py-3 text-white tabular-nums outline-none transition placeholder:text-slate-500 focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/25"
                    placeholder="e.g. 0.0025"
                  />
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-tp-primary px-6 py-3 text-center text-sm font-semibold text-white shadow-tp-glow-sm transition hover:bg-tp-primary-hover hover:shadow-tp-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-tp-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-tp-surface sm:text-base md:w-auto"
                  >
                    Calculate risk
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-950/25 px-4 py-2.5 text-sm text-amber-100">
                  {error}
                </div>
              )}

              {output && (
                <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
                  <div className="rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-950/35 to-tp-base/80 p-5 shadow-sm ring-1 ring-amber-400/10">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber-200/80">Risk Amount</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-amber-100">
                      $
                      {output.riskAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-amber-100/70">Amount you can lose on this trade.</p>
                  </div>
                  <div className="rounded-xl border border-tp-primary/30 bg-gradient-to-br from-tp-primary/15 to-tp-base/80 p-5 shadow-sm ring-1 ring-tp-primary/20">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-tp-primary-light">Suggested Lot Size</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-white">
                      {output.suggestedLot.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-tp-nav/80">Calculated from risk amount ÷ stop distance.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

