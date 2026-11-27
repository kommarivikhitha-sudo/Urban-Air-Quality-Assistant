import type { Habits, Profile } from '../data/scenarios';

interface Props {
  profile: Profile;
  onProfile: (p: Profile) => void;
  habits: Habits;
  onHabits: (h: Habits) => void;
}

const PROFILE_ITEMS: {
  key: keyof Profile;
  label: string;
  hint: string;
}[] = [
  {
    key: 'children',
    label: 'Young Children at Home',
    hint: 'Kids inhale more air per kg of body weight — advice gets stricter.',
  },
  {
    key: 'elderly',
    label: 'Elderly / Asthma-Sensitive Member',
    hint: 'Adds mask and clean-air-room guidance for sensitive lungs.',
  },
  {
    key: 'hepa',
    label: 'HEPA Air Purifier Available',
    hint: 'Off = we prioritise low-cost, no-purifier indoor hacks.',
  },
  {
    key: 'combustion',
    label: 'Gas Stove / Incense / Dhoop Used Daily',
    hint: 'Adds kitchen-exhaust and indoor-source controls.',
  },
];

const HABIT_ITEMS: { key: keyof Habits; label: string }[] = [
  { key: 'morningOutdoor', label: 'Morning outdoor walk or play before 10 AM' },
  { key: 'shortTrips', label: 'Multiple separate short vehicle/auto trips per week' },
  { key: 'idling', label: 'Engine idling during school pickup/drop-off' },
  { key: 'openWindows', label: 'Keeping balcony/street-facing windows open all morning' },
];

export default function ProfilePanel({
  profile,
  onProfile,
  habits,
  onHabits,
}: Props) {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Household Profile
        </h2>
        <ul className="mt-3 space-y-3">
          {PROFILE_ITEMS.map((item) => (
            <li key={item.key}>
              <label className="flex cursor-pointer items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-medium text-slate-800">
                    {item.label}
                  </span>
                  <span className="block text-xs text-slate-500">{item.hint}</span>
                </span>
                <span className="relative inline-flex shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={profile[item.key]}
                    onChange={(e) =>
                      onProfile({ ...profile, [item.key]: e.target.checked })
                    }
                  />
                  <span className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-sky-600 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-300" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
          Current Routine — habits to improve
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Tick a habit you recognise and tailored swaps appear in the tabs.
        </p>
        <ul className="mt-3 space-y-2.5">
          {HABIT_ITEMS.map((item) => (
            <li key={item.key}>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={habits[item.key]}
                  onChange={(e) =>
                    onHabits({ ...habits, [item.key]: e.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-800">{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
