/**
 * Run from project root: node src/patch-colors.mjs
 * Applies TradePilot palette to CalculatorSection.jsx (replace old indigo/cyan/fuchsia).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(__dirname, 'components', 'CalculatorSection.jsx')
let t = fs.readFileSync(file, 'utf8')

const pairs = [
  ["from-emerald-500 to-teal-600", 'from-tp-primary to-tp-primary-light'],
  ['from-violet-500 to-fuchsia-600', 'from-tp-success to-tp-success-light'],
  [
    'rounded-2xl border-2 border-cyan-200/60 bg-gradient-to-br from-cyan-50/90 via-white to-fuchsia-50/50 p-5 shadow-md ring-1 ring-indigo-100/80',
    'rounded-2xl border-2 border-tp-border bg-gradient-to-br from-tp-surface-tint/90 via-white to-tp-surface/80 p-5 shadow-md ring-1 ring-tp-primary/10',
  ],
  [
    'mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-md md:mb-0',
    'mb-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-tp-border bg-gradient-to-br from-tp-primary to-tp-primary-light text-white shadow-md md:mb-0',
  ],
  ['md:border-cyan-200/80', 'md:border-tp-border'],
  ['from-indigo-700 to-fuchsia-700', 'from-tp-primary-dark to-tp-primary-light'],
  ['text-slate-600', 'text-tp-muted'],
  ['text-slate-800', 'text-tp-ink'],
  ['focus-visible:ring-indigo-500', 'focus-visible:ring-tp-primary'],
  ['hover:border-indigo-300', 'hover:border-tp-primary/40'],
  [
    'border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/35',
    'border-transparent bg-gradient-to-r from-tp-primary to-tp-primary-light text-white shadow-lg shadow-tp-primary/30',
  ],
  ['focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/25', 'focus:border-tp-primary focus:ring-2 focus:ring-tp-primary/20'],
  ['from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/25', 'from-tp-primary to-tp-primary-light text-white shadow-md shadow-tp-primary/25'],
  ['from-indigo-200 to-fuchsia-200', 'from-tp-border to-tp-primary/25'],
  ['border-indigo-200/40', 'border-tp-primary/15'],
  ['from-indigo-100 via-violet-50 to-cyan-100', 'from-tp-surface-tint/80 via-white to-tp-surface'],
  [
    'radial-gradient(ellipse 70% 55% at 15% 20%, rgba(129, 140, 248, 0.35), transparent 50%), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(244, 114, 182, 0.2), transparent 45%), radial-gradient(ellipse 55% 45% at 50% 100%, rgba(34, 211, 238, 0.28), transparent 50%)',
    'radial-gradient(ellipse 70% 55% at 15% 20%, rgba(31, 102, 244, 0.18), transparent 50%), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(60, 131, 246, 0.12), transparent 45%), radial-gradient(ellipse 55% 45% at 50% 100%, rgba(16, 183, 127, 0.1), transparent 50%)',
  ],
  ['bg-cyan-300/30', 'bg-tp-primary/20'],
  ['bg-violet-400/25', 'bg-tp-primary-light/15'],
  ['from-cyan-400 via-indigo-500 to-fuchsia-500', 'from-tp-primary via-tp-primary-light to-tp-success'],
  ['from-indigo-700 via-violet-700 to-cyan-700', 'from-tp-primary-dark via-tp-primary to-tp-success'],
  ['text-slate-700', 'text-tp-muted'],
  ['text-indigo-800', 'text-tp-primary'],
  [
    'rounded-[1.75rem] bg-gradient-to-br from-cyan-400/80 via-indigo-500/60 to-fuchsia-500/70 p-[2px] shadow-[0_28px_56px_-12px_rgba(79,70,229,0.38),0_12px_28px_-10px_rgba(6,182,212,0.22)]',
    'rounded-[1.75rem] bg-gradient-to-br from-tp-primary/85 via-tp-primary-light/70 to-tp-success/45 p-[2px] shadow-tp-glow',
  ],
  [
    'rounded-2xl border border-indigo-100/80 bg-gradient-to-br from-white via-indigo-50/40 to-fuchsia-50/30 p-4 shadow-[0_16px_40px_-12px_rgba(99,102,241,0.2)] ring-1 ring-fuchsia-100/50 md:p-6',
    'rounded-2xl border border-tp-border bg-gradient-to-br from-white via-tp-surface-tint/50 to-tp-surface/90 p-4 shadow-tp-glow-sm ring-1 ring-tp-primary/8 md:p-6',
  ],
  ['text-indigo-600', 'text-tp-primary'],
  ['from-indigo-500 to-fuchsia-500', 'from-tp-primary to-tp-primary-light'],
  ['ring-indigo-50/80', 'ring-tp-primary/8'],
  ['border-indigo-100/80', 'border-tp-border'],
  ['border-indigo-100/70', 'border-tp-border'],
  ['bg-indigo-100', 'bg-tp-surface-tint'],
  ['text-indigo-800', 'text-tp-primary'],
  [
    'from-indigo-100 via-fuchsia-100 to-cyan-100 accent-fuchsia-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-fuchsia-500 [&::-webkit-slider-thumb]:to-indigo-600 [&::-webkit-slider-thumb]:shadow-md',
    'from-tp-surface-tint via-blue-100 to-emerald-50 accent-tp-primary [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-tp-primary [&::-webkit-slider-thumb]:to-tp-primary-light [&::-webkit-slider-thumb]:shadow-md',
  ],
  ['bg-cyan-100', 'bg-emerald-50'],
  ['text-cyan-900', 'text-tp-success'],
  [
    'from-cyan-100 via-indigo-100 to-violet-100 accent-cyan-600 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-indigo-600 [&::-webkit-slider-thumb]:shadow-md',
    'from-tp-surface-tint via-blue-50 to-emerald-50 accent-tp-success [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-tp-success [&::-webkit-slider-thumb]:to-tp-success-light [&::-webkit-slider-thumb]:shadow-md',
  ],
  [
    'rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-6 py-3 text-sm font-bold text-slate-900 shadow-[0_10px_28px_-6px_rgba(16,185,129,0.45)] transition hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 hover:shadow-[0_14px_36px_-6px_rgba(20,184,166,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 active:scale-[0.98] md:w-auto md:self-end',
    'rounded-2xl bg-tp-primary px-6 py-3 text-sm font-bold text-white shadow-tp-glow-sm transition hover:bg-tp-primary-hover hover:shadow-tp-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-tp-warning focus-visible:ring-offset-2 active:scale-[0.98] md:w-auto md:self-end',
  ],
  [
    'rounded-2xl border border-cyan-100/90 bg-gradient-to-br from-white via-cyan-50/50 to-indigo-50/40 p-5 shadow-inner ring-1 ring-indigo-50 md:p-6',
    'rounded-2xl border border-tp-border bg-gradient-to-br from-white via-tp-surface-tint/60 to-tp-surface/80 p-5 shadow-inner ring-1 ring-tp-primary/8 md:p-6',
  ],
  ['border-indigo-100/80 pb-3', 'border-tp-border pb-3'],
  ['from-indigo-600 to-violet-600', 'from-tp-primary to-tp-primary-light'],
  ['border-indigo-200', 'border-tp-border'],
  ['text-indigo-900', 'text-tp-ink'],
  ['from-emerald-100 to-teal-100', 'from-emerald-50 to-teal-50'],
  ['text-emerald-900', 'text-tp-success'],
  ['from-indigo-700 to-fuchsia-700', 'from-tp-primary to-tp-primary-light'],
  ['border-indigo-200/80', 'border-tp-primary/20'],
  ['border-indigo-100/90', 'border-tp-border'],
  ['text-emerald-600', 'text-tp-success'],
  ['text-orange-600', 'text-tp-warning'],
  ['from-amber-400 to-orange-400', 'from-tp-warning to-amber-500'],
  ['focus-visible:ring-fuchsia-400', 'focus-visible:ring-tp-primary'],
]

let n = 0
for (const [a, b] of pairs) {
  const c = t.split(a).length - 1
  if (c > 0) {
    t = t.split(a).join(b)
    n += c
  }
}

fs.writeFileSync(file, t, 'utf8')
console.log('CalculatorSection.jsx: replacements applied (substring match count ~' + n + ')')
