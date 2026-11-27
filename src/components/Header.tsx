import {
  Wind,
  MapPin,
  Sparkles,
  RefreshCw,
  Loader2,
  Info,
  Leaf,
  AlertTriangle,
} from 'lucide-react';
import { CITIES, PRESETS, aqiLevel, type Scenario } from '../data/scenarios';

interface Props {
  scenario: Scenario;
  city: string;
  onCity: (c: string) => void;
  liveLoading: boolean;
  liveError: string | null;
  onFetchLive: () => void;
  onPreset: (id: string) => void;
  onReset: () => void;
}

export default function Header({
  scenario,
  city,
  onCity,
  liveLoading,
  liveError,
  onFetchLive,
  onPreset,
  onReset,
}: Props) {
  const lvl = aqiLevel(scenario.aqi);
  const isLive = scenario.id === 'live';

  return (
    <header className="space-y-4">
      {/* Title row */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
            <Wind className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              VayuCare
            </h1>
            <p className="text-sm text-slate-600">
              Family Winter Smog &amp; Low-Emission Assistant
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <MapPin className="h-4 w-4 shrink-0 text-slate-500" />
            <select
              value={city}
              onChange={(e) => onCity(e.target.value)}
              className="bg-transparent text-sm font-medium text-slate-800 outline-none"
            >
              {CITIES.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <button
            onClick={onFetchLive}
            disabled={liveLoading}
            className="flex items-center gap-2 rounded-xl bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:opacity-60"
          >
            {liveLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Fetch Live AQI
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Reset to Default Scenario
          </button>
        </div>
      </div>

      {/* Status card */}
      <div className={`rounded-2xl border p-5 shadow-sm ${lvl.bg} ${lvl.border}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <span className="text-2xl font-bold leading-none text-slate-900">
                {scenario.aqi}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                AQI
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${lvl.dot}`} />
                <span className={`text-lg font-bold ${lvl.text}`}>{lvl.name}</span>
                <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {isLive ? 'Live · Open-Meteo' : scenario.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                PM2.5 <span className="font-semibold">{scenario.pm25} µg/m³</span>
                <span className="mx-2 text-slate-400">|</span>
                PM10 <span className="font-semibold">{scenario.pm10} µg/m³</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
              <span className="text-slate-700">
                Peak: <span className="font-semibold">{scenario.peakWindow}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
              <Leaf className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="text-slate-700">
                Safe window: <span className="font-semibold">{scenario.safeWindow}</span>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/80 px-3 py-2.5">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <p className="text-sm leading-relaxed text-slate-700">
            <span className="font-semibold">Why is the air like this?</span>{' '}
            {scenario.explainer}
          </p>
        </div>
      </div>

      {liveError && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {liveError}
        </p>
      )}

      {/* Presets */}
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Sparkles className="h-3.5 w-3.5" /> Demo Scenario Switcher
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {PRESETS.map((p) => {
            const active = scenario.id === p.id;
            const pl = aqiLevel(p.aqi);
            return (
              <button
                key={p.id}
                onClick={() => onPreset(p.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-sky-500 bg-white shadow-md ring-2 ring-sky-200'
                    : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800">{p.label}</span>
                  <span className={`text-xs font-bold ${pl.text}`}>{p.aqi}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${pl.dot}`} />
                  <span className="text-xs text-slate-500">
                    PM2.5 {p.pm25} · PM10 {p.pm10} µg/m³
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
