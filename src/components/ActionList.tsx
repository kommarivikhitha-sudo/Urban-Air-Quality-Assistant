import type { FamilyAction } from '../data/actions';

interface Props {
  actions: FamilyAction[];
  checked: Set<string>;
  onToggle: (id: string) => void;
}

function badgeTone(badge: string) {
  if (badge.startsWith('−') || badge.startsWith('-'))
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (badge === 'High impact')
    return 'border-sky-200 bg-sky-50 text-sky-700';
  if (badge.startsWith('No purifier') || badge.startsWith('Low-cost') || badge === 'Free')
    return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-slate-200 bg-slate-100 text-slate-600';
}

export default function ActionList({ actions, checked, onToggle }: Props) {
  return (
    <ul className="space-y-2.5">
      {actions.map((a) => {
        const on = checked.has(a.id);
        return (
          <li key={a.id}>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition ${
                on
                  ? 'border-sky-300 bg-sky-50/60 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggle(a.id)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {a.slot && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
                        a.slotTone === 'rose'
                          ? 'bg-rose-100 text-rose-700'
                          : a.slotTone === 'emerald'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {a.slot}
                    </span>
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      on ? 'text-sky-900' : 'text-slate-900'
                    }`}
                  >
                    {a.title}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {a.desc}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {a.badges.map((b) => (
                    <span
                      key={b}
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${badgeTone(b)}`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
