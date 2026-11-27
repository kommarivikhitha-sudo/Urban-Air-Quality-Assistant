import { useState } from 'react';
import {
  Droplets,
  Car,
  Home,
  ChevronDown,
  Calculator,
  Wind,
} from 'lucide-react';
import type { ImpactTotals } from '../lib/impact';
import type { Scenario } from '../data/scenarios';

interface Props {
  totals: ImpactTotals;
  scenario: Scenario;
  activeCount: number;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  accent,
}: {
  icon: typeof Droplets;
  label: string;
  value: number;
  unit: string;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide leading-snug text-slate-500">
          {label}
        </p>
        <p className="text-xl font-bold leading-tight text-slate-900">
          {value}{' '}
          <span className="text-xs font-medium text-slate-500">{unit}</span>
        </p>
      </div>
    </div>
  );
}

export default function ImpactCards({ totals, scenario, activeCount }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard
          icon={Droplets}
          label="PM2.5 Exposure Avoided"
          value={totals.pm25}
          unit="µg/m³·hrs / week"
          accent="bg-rose-500"
        />
        <MetricCard
          icon={Car}
          label="Tailpipe CO₂ Saved"
          value={totals.co2}
          unit="kg / week"
          accent="bg-sky-600"
        />
        <MetricCard
          icon={Home}
          label="Clean Indoor Air Gained"
          value={totals.indoor}
          unit="hours / day"
          accent="bg-emerald-600"
        />
      </div>

      <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-sm">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between px-4 py-2.5 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Calculator className="h-4 w-4 text-slate-500" />
            How we calculate this
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {activeCount} active {activeCount === 1 ? 'action' : 'actions'}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
        {open && (
          <div className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm text-slate-600">
            <ul className="space-y-2.5 leading-relaxed">
              <li>
                <strong className="text-slate-800">PM2.5 Exposure Avoided.</strong>{' '}
                Each indoor action contributes{' '}
                <code className="rounded bg-slate-100 px-1">PM2.5 × hours × cut&nbsp;%</code>{' '}
                — e.g. gap-sealing during the peak window assumes it trims ~35% of
                indoor infiltration for 3 peak hours a day, scaled to your live
                PM2.5 ({scenario.pm25} µg/m³). Routine actions use typical exposure
                rates for commuting, walking and play. Summed per week.
              </li>
              <li>
                <strong className="text-slate-800">Tailpipe CO₂ Saved.</strong>{' '}
                Trip-bundling = 3 short trips × 0.52 kg/km × 1 km saved; no-idling =
                10 min/day × 2.3 L/hr idle burn × 2.31 kg CO₂/L; walk/metro swaps =
                2 km × 0.6 kg/km × 2 trips/wk. Summed per week.
              </li>
              <li>
                <strong className="text-slate-800">Clean Indoor Air Gained.</strong>{' '}
                Hours per day the home holds low-PM air from each active hack —
                purification/ventilation hours, and reduced source hours (cooking
                exhaust, incense skipped) count too. Summed per day.
              </li>
              <li className="flex items-start gap-1.5 text-xs text-slate-500">
                <Wind className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Estimates use standard urban-India exposure factors; they are
                directional guidance, not measurements.
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
