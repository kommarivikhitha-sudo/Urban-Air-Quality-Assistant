import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import ImpactCards from './components/ImpactCards';
import ProfilePanel from './components/ProfilePanel';
import Workspace from './components/Workspace';
import {
  CITIES,
  DEFAULT_CHECKED,
  DEFAULT_HABITS,
  DEFAULT_PROFILE,
  PRESETS,
  buildLiveScenario,
  type Habits,
  type Profile,
  type Scenario,
} from './data/scenarios';
import { ACTIONS } from './data/actions';
import { computeImpact } from './lib/impact';

export default function App() {
  const [city, setCity] = useState<string>(CITIES[0].name);
  const [scenario, setScenario] = useState<Scenario>(PRESETS[0]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [habits, setHabits] = useState<Habits>(DEFAULT_HABITS);
  const [checked, setChecked] = useState<Set<string>>(new Set(DEFAULT_CHECKED));

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const pickPreset = useCallback((id: string) => {
    setLiveError(null);
    const p = PRESETS.find((x) => x.id === id);
    if (p) setScenario(p);
  }, []);

  const reset = useCallback(() => {
    setScenario(PRESETS[0]);
    setProfile(DEFAULT_PROFILE);
    setHabits(DEFAULT_HABITS);
    setChecked(new Set(DEFAULT_CHECKED));
    setLiveError(null);
  }, []);

  const fetchLive = useCallback(async () => {
    setLiveLoading(true);
    setLiveError(null);
    const c = CITIES.find((x) => x.name === city) ?? CITIES[0];
    try {
      const res = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${c.lat}&longitude=${c.lon}&current=pm2_5,pm10,us_aqi`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: unknown = await res.json();
      const cur = (json as { current?: { pm2_5?: number; pm10?: number; us_aqi?: number } }).current;
      const pm25 = Math.round(cur?.pm2_5 ?? 0);
      const pm10 = Math.round(cur?.pm10 ?? 0);
      const aqi = Math.round(cur?.us_aqi ?? 0);
      if (!pm25 || !aqi) throw new Error('Empty reading');
      setScenario(buildLiveScenario(c.name, { aqi, pm25, pm10 }));
    } catch {
      setLiveError(
        `Live AQI unavailable for ${c.name} right now — showing the active preset instead.`,
      );
    } finally {
      setLiveLoading(false);
    }
  }, [city]);

  const totals = useMemo(
    () => computeImpact(ACTIONS, checked, scenario.pm25),
    [checked, scenario.pm25],
  );
  const activeCount = useMemo(
    () => ACTIONS.filter((a) => checked.has(a.id)).length,
    [checked],
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Header
          scenario={scenario}
          city={city}
          onCity={setCity}
          liveLoading={liveLoading}
          liveError={liveError}
          onFetchLive={fetchLive}
          onPreset={pickPreset}
          onReset={reset}
        />

        <main className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-[35fr_65fr]">
          <ProfilePanel
            profile={profile}
            onProfile={setProfile}
            habits={habits}
            onHabits={setHabits}
          />
          <div className="space-y-4">
            <ImpactCards totals={totals} scenario={scenario} activeCount={activeCount} />
            <Workspace
              checked={checked}
              onToggle={toggle}
              scenario={scenario}
              profile={profile}
              habits={habits}
            />
          </div>
        </main>

        <footer className="mt-8 pb-4 text-center text-xs text-slate-500">
          VayuCare · Demo estimates using standard urban-India exposure factors ·
          Not a substitute for official health advisories
        </footer>
      </div>
    </div>
  );
}
