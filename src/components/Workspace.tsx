import { useEffect, useState } from 'react';
import { Clock, Sun, Sunrise, CloudSun, Moon, Zap } from 'lucide-react';
import {
  INDOOR_ACTIONS,
  ROUTINE_ACTIONS,
  type FamilyAction,
} from '../data/actions';
import {
  TIME_SLOTS,
  riskStyle,
  type Habits,
  type Profile,
  type Scenario,
} from '../data/scenarios';
import ActionList from './ActionList';

interface Props {
  checked: Set<string>;
  onToggle: (id: string) => void;
  scenario: Scenario;
  profile: Profile;
  habits: Habits;
}

type TabId = 'indoor' | 'routines' | 'timeline';

const TABS: { id: TabId; label: string }[] = [
  { id: 'indoor', label: 'Indoor Air Hacks' },
  { id: 'routines', label: 'Low-Emission Routines' },
  { id: 'timeline', label: 'Day Timeline Planner' },
];

export default function Workspace({
  checked,
  onToggle,
  scenario,
  profile,
  habits,
}: Props) {
  const [tab, setTab] = useState<TabId>('indoor');
  const [wasPeak, setWasPeak] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const inPeakNow = scenario.peakWindow !== 'None';
  useEffect(() => {
    if (inPeakNow && !wasPeak) {
      setToast('Smog peak window in progress — indoor hacks are prioritised.');
      const t = setTimeout(() => setToast(null), 6000);
      return () => clearTimeout(t);
    }
    setWasPeak(inPeakNow);
  }, [inPeakNow, wasPeak]);

  const visible = (list: FamilyAction[]) =>
    list.filter(
      (a) => !a.show || a.show({ profile, habits }),
    );

  const indoor = visible(INDOOR_ACTIONS);
  const routines = visible(ROUTINE_ACTIONS);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-200 p-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.id
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-5">
        {toast && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-800">
            <Zap className="mt-0.5 h-4 w-4 shrink-0" />
            {toast}
          </div>
        )}

        {tab === 'indoor' && (
          <>
            <p className="mb-3 text-sm text-slate-600">
              Time-slotted for today. Tick what you'll do — impact cards update
              instantly.
            </p>
            <ActionList actions={indoor} checked={checked} onToggle={onToggle} />
          </>
        )}

        {tab === 'routines' && (
          <>
            <p className="mb-3 text-sm text-slate-600">
              Daily swaps matched to your current habits — effort and impact shown
              per swap.
            </p>
            <ActionList actions={routines} checked={checked} onToggle={onToggle} />
          </>
        )}

        {tab === 'timeline' && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Four time blocks with outdoor risk and the single best family move
              for each.
            </p>
            {TIME_SLOTS.map((slot, i) => {
              const r = riskStyle(scenario.slotRisk[i]);
              const Icon = slot.icon;
              return (
                <div
                  key={slot.name}
                  className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${r.card}`}
                >
                  <div className="flex min-w-0 items-center gap-3 sm:w-64 sm:shrink-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{slot.name}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="h-3 w-3" />
                        {slot.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:w-44 sm:shrink-0">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${r.dot}`} />
                    <span className={`text-sm font-semibold ${r.text}`}>
                      {r.label}
                    </span>
                  </div>
                  <p className="flex-1 text-sm leading-relaxed text-slate-700">
                    <span className="font-semibold">#1 action: </span>
                    {scenario.slotAction[i]}
                  </p>
                </div>
              );
            })}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
              <Sun className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
              Safe ventilation window for {scenario.label}:{' '}
              <span className="font-semibold text-slate-800">{scenario.safeWindow}</span>
              <span className="mx-1 text-slate-300">·</span>
              <Sunrise className="h-3.5 w-3.5 shrink-0 text-rose-500" />
              Peak window:{' '}
              <span className="font-semibold text-slate-800">{scenario.peakWindow}</span>
              <Moon className="ml-auto hidden h-3.5 w-3.5 text-slate-400 sm:block" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
