import { useEffect, useMemo, useState } from 'react'
import { FaChartLine, FaShieldAlt } from 'react-icons/fa'

const num = (v) => {
  const n = parseFloat(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : NaN
}

/** Copy ROI calculator: duration is limited to this many months (slider + validation). */
const MAX_DURATION_MONTHS = 24

function computeRoi(capital, roiPct, months) {
  const c = num(capital)
  const r = num(roiPct)
  const m = num(months)
  if (
    !Number.isFinite(c) ||
    c <= 0 ||
    !Number.isFinite(r) ||
    !Number.isFinite(m) ||
    m < 0 ||
    m > MAX_DURATION_MONTHS
  ) {
    return null
  }
  const finalCapital = c * Math.pow(1 + r / 100, m)
  return {
    finalCapital,
    netProfit: finalCapital - c,
    months: m,
  }
}

const usd = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)

const labelClass = 'text-[10px] font-bold uppercase tracking-[0.14em] text-tp-muted'

function venueLabel(marketKind) {
  return marketKind === 'webull' ? 'Webull' : 'Forex'
}

const TRADERS = {
  ryan: {
    short: 'Ryan - AI Trader',
    fullName: 'Ryan – AI Trader',
    tag: 'AI Trader',
    hint: 'Strong fit for Forex-style copy feeds and systematic FX models.',
    initials: 'R',
    accent: 'from-tp-primary to-tp-primary-light',
  },
  angel: {
    short: 'Angel - Market Wizard',
    fullName: 'Angel – Market Wizard',
    tag: 'Market Wizard',
    hint: 'Built around Webull-style equities, screeners, and copy flows.',
    initials: 'A',
    accent: 'from-teal-600 to-tp-success',
  },
}

/** Starting capital preset when each trader is selected (not a single shared default). */
const DEFAULT_CAPITAL_BY_TRADER = {
  ryan: '1000',
  angel: '8000',
}

/** One-month example returns per trader (edit labels / % here). */
const TRADER_SCENARIO_OPTIONS = {
  ryan: [
    { id: 'feb', label: 'Ryan – AI Trader February-PNL — 25%', pct: 25 },
    { id: 'mar', label: 'Ryan – AI Trader March-PNL — 30%', pct: 30 },
    { id: 'apr', label: 'Ryan – AI Trader April-PNL (in progress — no locked % yet)', pct: null },
    { id: 'future', label: 'Ryan – AI Trader with Future plan — custom average %', pct: null, isCustom: true },
  ],
  angel: [
    { id: 'feb', label: 'Angel - Market Wizard February-PNL — 40%', pct: 40 },
    { id: 'mar', label: 'Angel - Market Wizard March-PNL — 50%', pct: 50 },
    { id: 'apr', label: 'Angel - Market Wizard April-PNL — 50% (in progress)', pct: 50 },
    { id: 'future', label: 'Angel - Market Wizard with Future plan — custom average %', pct: null, isCustom: true },
  ],
}

function computeTraderOneMonthExample(traderId, capitalStr, scenarioId, customPctStr) {
  const opts = TRADER_SCENARIO_OPTIONS[traderId] ?? TRADER_SCENARIO_OPTIONS.ryan
  const sel = opts.find((o) => o.id === scenarioId) ?? opts[0]
  const c = num(capitalStr)
  const pct = sel.isCustom ? num(customPctStr) : sel.pct

  if (!Number.isFinite(c) || c <= 0) {
    return { ok: false, reason: 'capital', scenarioLabel: sel.label }
  }
  if (!Number.isFinite(pct) || pct < 0) {
    return { ok: false, reason: 'pct', scenarioLabel: sel.label }
  }

  const profit = c * (pct / 100)
  return {
    ok: true,
    profit,
    balanceAfter: c + profit,
    pct,
    scenarioLabel: sel.label,
    isCustom: !!sel.isCustom,
  }
}

function MethodologyNotice() {
  return (
    <aside
      className="rounded-xl border border-white/10 bg-tp-base/60 p-3 shadow-md ring-1 ring-white/5 md:flex md:items-start md:gap-4 md:p-4"
      aria-labelledby="calc-notice-heading"
    >
      <span
        className="mb-3 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-tp-primary text-white shadow-md md:mb-0"
        aria-hidden
      >
        <FaShieldAlt className="text-base" />
      </span>
      <div className="min-w-0 md:border-l md:border-white/10 md:pl-4">
        <h3 id="calc-notice-heading" className="text-[11px] font-bold uppercase tracking-[0.16em] text-white">
          Methodology and risk notice
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-tp-muted md:text-sm">
          All figures are{' '}
          <strong className="font-semibold text-tp-nav">hypothetical projections</strong> derived only from
          the inputs above (starting capital, assumed monthly ROI, and duration). The model uses monthly
          compounding at a constant rate and excludes spreads, commissions, withdrawals, taxes, and
          real-world drawdowns.
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-tp-muted md:text-sm">
          Trading and copy trading carry substantial risk of loss. Past or simulated performance is{' '}
          <strong className="font-semibold text-tp-nav">not</strong> a guarantee of future results. Use only
          risk capital you can afford to lose.
        </p>
      </div>
    </aside>
  )
}

/** Market toggles: equal width inside the left column (no max-width cap). */
const segMarketBase =
  'flex h-9 min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border px-2 text-[11px] font-semibold leading-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-tp-primary focus-visible:ring-offset-2 focus-visible:ring-offset-tp-base active:scale-[0.98] sm:px-2.5 sm:text-xs'

const traderSegBase =
  'flex h-9 min-h-9 w-full min-w-0 max-w-[11.5rem] flex-1 items-center justify-start gap-1.5 rounded-md border px-1.5 text-left text-[10px] font-semibold leading-tight transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-tp-primary focus-visible:ring-offset-2 focus-visible:ring-offset-tp-base active:scale-[0.98] sm:max-w-[12.5rem] sm:gap-2 sm:px-2 sm:text-xs'
const segOff =
  'border-white/10 bg-tp-base/80 text-tp-nav shadow-sm hover:border-tp-primary/40 hover:bg-tp-elevated/80'
const segOn = 'border-transparent bg-tp-primary text-white shadow-md shadow-tp-glow-sm'

const inputCompact =
  'box-border flex h-9 min-h-9 w-full items-center rounded-lg border border-white/10 bg-tp-base px-3 text-sm font-semibold text-white tabular-nums shadow-inner outline-none transition placeholder:text-slate-500 focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/25'

const inputWithSlider =
  'w-full rounded-xl border border-white/10 bg-tp-base text-center text-base font-bold tabular-nums text-white shadow-md shadow-black/20 ring-1 ring-white/5 outline-none transition placeholder:text-slate-500 focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/25 sm:max-w-none sm:w-[9.5rem] sm:shrink-0 sm:px-4 sm:py-3 md:w-[11rem] md:px-5'

function StepIndicator({ inputsReady, hasLocked, hasPreview }) {
  const steps = [
    { id: 1, label: 'Market', done: true },
    { id: 2, label: 'Capital & ROI', done: inputsReady },
    { id: 3, label: 'Projection', done: hasLocked || hasPreview },
  ]
  return (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1.5 sm:gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[10px] ${
              s.done ? 'bg-tp-primary text-white shadow-tp-glow-sm' : 'bg-white/5 text-tp-muted'
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] sm:h-5 sm:w-5 sm:text-[10px] ${
                s.done ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'
              }`}
            >
              {s.id}
            </span>
            {s.label}
          </span>
          {i < steps.length - 1 && (
            <span className="hidden h-px w-4 bg-gradient-to-r from-white/20 to-white/5 sm:block sm:w-8" aria-hidden />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CalculatorSection() {
  const [marketKind, setMarketKind] = useState('forex')
  const [traderId, setTraderId] = useState('ryan')
  const [capital, setCapital] = useState(DEFAULT_CAPITAL_BY_TRADER.ryan)
  const [roiPct, setRoiPct] = useState('20')
  const [months, setMonths] = useState('3')
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState(null)
  const [traderScenarioId, setTraderScenarioId] = useState('feb')
  const [traderScenarioCustomPct, setTraderScenarioCustomPct] = useState('')

  const venue = useMemo(() => venueLabel(marketKind), [marketKind])
  const trader = TRADERS[traderId] ?? TRADERS.ryan
  const preview = useMemo(() => computeRoi(capital, roiPct, months), [capital, roiPct, months])
  const scenarioOptions = TRADER_SCENARIO_OPTIONS[traderId] ?? TRADER_SCENARIO_OPTIONS.ryan
  const selectedScenario = scenarioOptions.find((o) => o.id === traderScenarioId) ?? scenarioOptions[0]
  const traderOneMonth = useMemo(
    () => computeTraderOneMonthExample(traderId, capital, traderScenarioId, traderScenarioCustomPct),
    [traderId, capital, traderScenarioId, traderScenarioCustomPct],
  )

  useEffect(() => {
    setCapital(DEFAULT_CAPITAL_BY_TRADER[traderId] ?? DEFAULT_CAPITAL_BY_TRADER.ryan)
    setTraderScenarioId('feb')
    setTraderScenarioCustomPct('')
  }, [traderId])

  useEffect(() => {
    if (selectedScenario?.isCustom) {
      const customPct = num(traderScenarioCustomPct)
      if (Number.isFinite(customPct) && customPct >= 0) {
        setRoiPct(String(customPct))
      }
      return
    }
    if (selectedScenario && Number.isFinite(selectedScenario.pct) && selectedScenario.pct >= 0) {
      setRoiPct(String(selectedScenario.pct))
    }
  }, [selectedScenario, traderId, traderScenarioCustomPct])

  const roiSlider = Math.min(100, Math.max(0, num(roiPct) || 0))
  const monthsSlider = Math.min(MAX_DURATION_MONTHS, Math.max(0, Math.round(num(months) || 0)))

  useEffect(() => {
    setSnapshot(null)
    setError(null)
  }, [capital, roiPct, months, marketKind, traderId])

  const handleSubmit = (e) => {
    e.preventDefault()
    const r = computeRoi(capital, roiPct, months)
    if (!r) {
      setSnapshot(null)
      setError(
        `Enter a starting capital greater than 0, ROI, and months from 0 to ${MAX_DURATION_MONTHS} only.`,
      )
      return
    }
    setError(null)
    setSnapshot(r)
  }

  const monthsLabelFor = (m) =>
    m && Number.isInteger(m) ? String(m) : m ? m.toLocaleString('en-US', { maximumFractionDigits: 1 }) : ''

  const monthsLabelSnap = snapshot ? monthsLabelFor(snapshot.months) : ''
  const monthsLabelPrev = preview ? monthsLabelFor(preview.months) : ''

  const inputsReady =
    preview !== null &&
    String(capital).trim() !== '' &&
    String(roiPct).trim() !== '' &&
    String(months).trim() !== ''

  return (
    <section
      id="calculator"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/10 py-6 md:py-10"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(ellipse 70% 55% at 15% 25%, rgba(16, 42, 90, 0.35), transparent 50%), radial-gradient(ellipse 60% 50% at 90% 15%, rgba(13, 43, 45, 0.28), transparent 48%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-tp-primary/50 to-transparent opacity-90" />

      <div className="container relative">
        <div className="row justify-center">
          <div className="col-12 col-xl-11">
            <h2 className="text-center text-xl font-bold tracking-tight text-white sm:text-2xl md:text-4xl">
              Copy trading ROI (Return on Investment)
            </h2>
            <p className="mx-auto mt-1.5 max-w-2xl px-1 text-center text-xs leading-relaxed text-tp-muted sm:text-sm md:text-base">
              One workspace: choose market and trader, set capital and ROI, then review your projection—press{' '}
              <span className="font-semibold text-tp-primary-light">Calculate</span> to lock.
            </p>

            <div className="mx-auto mt-3 max-w-6xl rounded-2xl border border-white/10 bg-tp-surface/95 p-[2px] shadow-tp-glow-sm ring-1 ring-white/5 backdrop-blur-xl transition hover:shadow-tp-glow md:mt-4">
              <div className="rounded-[1.2rem] bg-tp-surface p-3 sm:p-4 md:p-5 lg:p-6">
                <StepIndicator
                  inputsReady={inputsReady}
                  hasLocked={snapshot !== null}
                  hasPreview={preview !== null}
                />

                <form onSubmit={handleSubmit}>
                  <div className="rounded-xl border border-white/10 bg-tp-base/50 p-2.5 shadow-inner ring-1 ring-white/5 sm:p-3 md:p-4">
                    <p className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-tp-primary-light sm:text-xs">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-tp-primary text-white shadow-md">
                        <FaChartLine className="text-xs" aria-hidden />
                      </span>
                      Calculator workspace
                    </p>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end md:gap-x-6 md:gap-y-0">
                      <div className="flex min-w-0 flex-col">
                        <p className={labelClass}>Market</p>
                        <div className="mt-1.5 flex w-full gap-1.5 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setMarketKind('forex')
                              setTraderId('ryan')
                            }}
                            className={`${segMarketBase} ${marketKind === 'forex' ? segOn : segOff}`}
                          >
                            <img
                              src="/oanda-logo.png"
                              alt=""
                              width={18}
                              height={18}
                              className={`h-5 w-5 shrink-0 object-contain transition sm:h-6 sm:w-6 ${
                                marketKind === 'forex' ? 'brightness-0 invert' : 'opacity-80'
                              }`}
                            />
                            <span className="truncate">Forex</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMarketKind('webull')
                              setTraderId('angel')
                            }}
                            className={`${segMarketBase} ${marketKind === 'webull' ? segOn : segOff}`}
                          >
                            <img
                              src="/webull-logo.png"
                              alt=""
                              width={18}
                              height={18}
                              className={`h-5 w-5 shrink-0 object-contain transition sm:h-6 sm:w-6 ${
                                marketKind === 'webull' ? 'brightness-0 invert' : 'opacity-80'
                              }`}
                            />
                            <span className="truncate">Webull</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <label htmlFor="capital" className={labelClass}>
                          Starting capital ($)
                        </label>
                        <input
                          id="capital"
                          type="text"
                          inputMode="decimal"
                          value={capital}
                          onChange={(e) => setCapital(e.target.value)}
                          className={`${inputCompact} mt-1.5 text-sm font-bold sm:text-base`}
                          placeholder={DEFAULT_CAPITAL_BY_TRADER[traderId] ?? '1000'}
                        />
                      </div>
                    </div>

                    <div className="mt-2.5 rounded-xl border border-white/10 bg-tp-base/40 p-2.5 shadow-md ring-1 ring-white/5 sm:p-3">
                      <p className={labelClass}>Trader</p>
                      <div className="mt-1.5 flex flex-col gap-1.5 sm:flex-row sm:gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setTraderId('ryan')
                            setMarketKind('forex')
                          }}
                          className={`${traderSegBase} ${traderId === 'ryan' ? segOn : segOff}`}
                        >
                          <img
                            src="/rayyan-logo.png"
                            alt=""
                            width={18}
                            height={18}
                            className={`h-5 w-5 shrink-0 object-contain transition sm:h-6 sm:w-6 ${
                              traderId === 'ryan'
                                ? 'rounded bg-white/95 p-px ring-1 ring-white/50'
                                : 'opacity-80'
                            }`}
                          />
                          <span className="min-w-0 truncate sm:whitespace-normal">
                            <span className={traderId === 'ryan' ? 'text-white' : 'text-tp-nav'}>
                              {TRADERS.ryan.short}
                            </span>
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTraderId('angel')
                            setMarketKind('webull')
                          }}
                          className={`${traderSegBase} ${traderId === 'angel' ? segOn : segOff}`}
                        >
                          <img
                            src="/angel-logo.png"
                            alt=""
                            width={18}
                            height={18}
                            className={`h-5 w-5 shrink-0 object-contain transition sm:h-6 sm:w-6 ${
                              traderId === 'angel'
                                ? 'rounded bg-white/95 p-px ring-1 ring-white/50'
                                : 'opacity-80'
                            }`}
                          />
                          <span className="min-w-0 truncate sm:whitespace-normal">
                            <span className={traderId === 'angel' ? 'text-white' : 'text-tp-nav'}>
                              {TRADERS.angel.short}
                            </span>
                          </span>
                        </button>
                      </div>
                      <div className="mt-2 flex items-start gap-2 rounded-md border border-white/10 bg-tp-base/50 p-1.5 shadow-sm">
                        <img
                          src={traderId === 'angel' ? '/angel-logo.png' : '/rayyan-logo.png'}
                          alt=""
                          width={32}
                          height={32}
                          className="h-8 w-8 shrink-0 rounded bg-white/95 p-px ring-1 ring-white/40 object-contain"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <p className="text-xs font-semibold leading-tight text-white sm:text-sm">{trader.fullName}</p>
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-tp-nav">
                              {trader.tag}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-tp-muted sm:line-clamp-1">
                            {trader.hint}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 rounded-lg border border-white/10 bg-tp-base/50 p-2.5 shadow-sm ring-1 ring-white/5 sm:p-3">
                        <label htmlFor="trader-scenario" className={labelClass}>
                          Month selection (auto-applies to Avg. Monthly ROI)
                        </label>
                        <select
                          id="trader-scenario"
                          value={traderScenarioId}
                          onChange={(e) => setTraderScenarioId(e.target.value)}
                          className="mt-1.5 w-full cursor-pointer appearance-none rounded-lg border border-white/15 bg-tp-base/90 bg-[length:1rem] bg-[right_0.65rem_center] bg-no-repeat py-2.5 pl-3 pr-9 text-sm font-semibold text-white outline-none transition hover:border-tp-primary/40 focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/35 sm:text-[0.9375rem]"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          }}
                        >
                          {scenarioOptions.map((opt) => (
                            <option key={opt.id} value={opt.id} className="bg-tp-surface text-tp-ink">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <p className="mt-2 text-[11px] text-tp-muted">
                          Selected month rate automatically updates the ROI field and all final numbers are shown in
                          the Projection box below.
                        </p>
                        {selectedScenario?.isCustom && (
                          <div className="mt-2.5 rounded-lg border border-dashed border-tp-primary/35 bg-tp-primary/[0.07] p-2.5">
                            <label htmlFor="trader-scenario-custom" className={labelClass}>
                              Future custom average ROI (%)
                            </label>
                            <input
                              id="trader-scenario-custom"
                              type="text"
                              inputMode="decimal"
                              value={traderScenarioCustomPct}
                              onChange={(e) => setTraderScenarioCustomPct(e.target.value)}
                              className={`${inputCompact} mt-1.5 text-sm`}
                              placeholder="e.g. 35"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 items-end gap-2.5 pt-3 md:grid-cols-12 md:gap-4">
                      <div className="md:col-span-6">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label htmlFor="roi" className={labelClass}>
                            Avg. Monthly ROI (%)
                          </label>
                          <span className="rounded-full bg-tp-primary/20 px-2 py-0.5 text-xs font-bold tabular-nums text-tp-primary-light">
                            {roiSlider}%
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                          <input
                            id="roi"
                            type="text"
                            inputMode="decimal"
                            value={roiPct}
                            onChange={(e) => setRoiPct(e.target.value)}
                            className={`${inputWithSlider} text-sm sm:text-base`}
                            placeholder="20"
                          />
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={0.5}
                            value={roiSlider}
                            onChange={(e) => setRoiPct(e.target.value)}
                            className="h-2 w-full min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-tp-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-tp-primary [&::-webkit-slider-thumb]:shadow-md"
                            aria-label="Adjust monthly ROI percent"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <label htmlFor="duration" className={labelClass}>
                            Duration (months, max {MAX_DURATION_MONTHS})
                          </label>
                          <span className="rounded-full bg-teal-900/40 px-2 py-0.5 text-xs font-bold tabular-nums text-tp-success">
                            {monthsSlider} mo
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                          <input
                            id="duration"
                            type="text"
                            inputMode="decimal"
                            value={months}
                            onChange={(e) => {
                              const v = e.target.value
                              const n = num(v)
                              if (String(v).trim() !== '' && Number.isFinite(n) && n > MAX_DURATION_MONTHS) {
                                setMonths(String(MAX_DURATION_MONTHS))
                                return
                              }
                              setMonths(v)
                            }}
                            className={`${inputWithSlider} text-sm sm:text-base`}
                            placeholder="3"
                          />
                          <input
                            type="range"
                            min={1}
                            max={MAX_DURATION_MONTHS}
                            step={1}
                            value={Math.min(
                              MAX_DURATION_MONTHS,
                              Math.max(1, monthsSlider || 1),
                            )}
                            onChange={(e) => setMonths(e.target.value)}
                            className="h-2 w-full min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 accent-tp-success [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500 [&::-webkit-slider-thumb]:shadow-md"
                            aria-label="Adjust duration in months"
                          />
                        </div>
                      </div>

                      <div className="flex md:col-span-2 md:justify-end">
                        <button
                          type="submit"
                          className="w-full rounded-lg bg-tp-primary px-5 py-2.5 text-sm font-bold text-white shadow-tp-glow transition hover:bg-tp-primary-hover hover:shadow-tp-glow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-tp-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-tp-base active:scale-[0.98] md:w-auto md:self-end"
                        >
                          Calculate
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-tp-base/40 p-3 shadow-inner ring-1 ring-white/5 sm:p-4 md:mt-6 md:rounded-2xl md:p-6">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wide text-tp-muted">
                            Projection
                          </span>
                          {preview && !snapshot && (
                            <span className="animate-pulse rounded-full bg-tp-warning px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                              Live
                            </span>
                          )}
                          {snapshot && (
                            <span className="rounded-full bg-tp-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                              Locked
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <span className="rounded-full border border-white/15 bg-tp-base px-2.5 py-0.5 text-xs font-semibold text-tp-nav shadow-sm">
                            {venue}
                          </span>
                          {(snapshot || preview) && (
                            <span className="rounded-full bg-teal-950/50 px-2.5 py-0.5 text-xs font-bold text-tp-success">
                              {snapshot ? monthsLabelSnap : monthsLabelPrev} mo
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mb-3 text-center text-xs font-medium text-tp-muted md:text-left">
                        <span className="font-bold text-tp-primary-light">{trader.fullName}</span>
                        <span className="text-slate-500"> · </span>
                        {venue}
                      </p>

                      <div className="mb-3 rounded-lg border border-white/10 bg-tp-base/55 p-2.5 ring-1 ring-white/5 sm:p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-tp-muted">Selected month</p>
                          <span className="rounded-full bg-tp-primary/20 px-2 py-0.5 text-xs font-bold text-tp-primary-light">
                            {traderOneMonth.ok
                              ? `${traderOneMonth.pct}%`
                              : selectedScenario?.isCustom
                                ? 'Enter custom %'
                                : 'No fixed %'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-semibold text-white">{selectedScenario?.label}</p>
                        {!traderOneMonth.ok && traderOneMonth.reason === 'pct' && (
                          <p className="mt-1.5 text-[11px] text-amber-200">
                            {selectedScenario?.isCustom
                              ? 'Enter a valid custom average % to apply it in ROI and projection.'
                              : 'This month has no fixed percentage yet, so ROI stays as-is.'}
                          </p>
                        )}
                      </div>

                      {error && (
                        <div className="rounded-xl border border-red-500/30 bg-red-950/30 px-4 py-6 text-center text-sm font-medium text-red-200">
                          {error}
                        </div>
                      )}

                      {!error && snapshot && (
                        <div
                          key={`${snapshot.finalCapital}-${snapshot.netProfit}`}
                          className="animate-calc-result py-4 text-center"
                        >
                          <p className="text-tp-muted">
                            After {monthsLabelSnap} months, your estimated capital could be:
                          </p>
                          <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl md:text-5xl">
                            {usd(snapshot.finalCapital)}
                          </p>
                          <p className="mt-5 text-tp-muted">
                            Net profit:{' '}
                            <span className="font-bold tabular-nums text-tp-success">{usd(snapshot.netProfit)}</span>
                          </p>
                          {traderOneMonth.ok && (
                            <p className="mt-2 text-xs text-tp-muted">
                              One-month snapshot ({traderOneMonth.pct}%):{' '}
                              <span className="font-bold tabular-nums text-tp-nav">{usd(traderOneMonth.balanceAfter)}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {!error && !snapshot && preview && (
                        <div className="py-4 text-center">
                          <p className="text-xs font-bold uppercase tracking-wide text-tp-warning">Live preview</p>
                          <p className="mt-2 text-sm text-tp-muted">
                            After {monthsLabelPrev} months, estimated capital:
                          </p>
                          <p className="mt-1.5 text-2xl font-bold tabular-nums text-white sm:text-3xl md:text-4xl">
                            {usd(preview.finalCapital)}
                          </p>
                          <p className="mt-4 text-sm text-tp-muted">
                            Net profit:{' '}
                            <span className="font-bold tabular-nums text-tp-success">{usd(preview.netProfit)}</span>
                          </p>
                          {traderOneMonth.ok && (
                            <p className="mt-2 text-xs text-tp-muted">
                              One-month snapshot ({traderOneMonth.pct}%):{' '}
                              <span className="font-bold tabular-nums text-tp-nav">{usd(traderOneMonth.balanceAfter)}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {!error && !snapshot && !preview && (
                        <div className="rounded-xl border border-dashed border-white/15 bg-tp-base/30 px-3 py-6 text-center sm:px-4 sm:py-10">
                          <p className="mx-auto max-w-md text-sm text-tp-muted">
                            Enter valid capital, ROI, and duration (0–{MAX_DURATION_MONTHS} months). A{' '}
                            <span className="font-semibold text-tp-warning">Live</span> preview will appear here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>

                <div className="mt-5 border-t border-white/10 pt-4 md:mt-6 md:pt-5">
                  <MethodologyNotice />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


