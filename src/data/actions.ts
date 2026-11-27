import type { Habits, Profile } from './scenarios';

export interface ImpactResult {
  pm25: number;
  co2: number;
  indoor: number;
}

interface Ctx {
  pm25: number;
}

interface ShowCtx {
  profile: Profile;
  habits: Habits;
}

export interface FamilyAction {
  id: string;
  tab: 'indoor' | 'routines';
  slot?: string;
  slotTone?: 'rose' | 'emerald' | 'slate';
  title: string;
  desc: string;
  badges: string[];
  impact: (c: Ctx) => ImpactResult;
  show?: (c: ShowCtx) => boolean;
}

const FIXED_PM25: Record<string, number> = { mop: 120, noIncense: 160 };

export const ACTIONS: FamilyAction[] = [
  // ---------- Tab 1: Indoor air hacks ----------
  {
    id: 'seal',
    tab: 'indoor',
    slot: 'Peak Window',
    slotTone: 'rose',
    title: 'Seal door & window gaps with a damp cloth or draft stoppers',
    desc: 'Press rolled damp cloth or foam stoppers along door and window frames until the peak window ends — it cuts smog drifting in through gaps.',
    badges: ['Low-cost', 'High impact'],
    impact: (c) => ({ pm25: c.pm25 * 7.35, co2: 0, indoor: 2.5 }),
  },
  {
    id: 'cleanRoomHepa',
    tab: 'indoor',
    slot: 'Night',
    slotTone: 'emerald',
    title: 'Run the Clean-Air Bedroom (HEPA purifier)',
    desc: 'Keep one bedroom shut and run the purifier on auto from bedtime to wake-up so the family sleeps in the cleanest air of the day.',
    badges: ['With purifier', 'High impact'],
    impact: (c) => ({ pm25: c.pm25 * 28, co2: 0, indoor: 3 }),
    show: ({ profile }) => profile.hepa,
  },
  {
    id: 'cleanRoomDiy',
    tab: 'indoor',
    slot: 'Night',
    slotTone: 'emerald',
    title: "Set up a no-purifier 'Clean-Air Bedroom'",
    desc: 'Pick one bedroom, tape its gaps, hang a damp towel over the door bottom and point a box fan through a folded damp cloth as a DIY filter.',
    badges: ['No purifier', 'Low-cost'],
    impact: (c) => ({ pm25: c.pm25 * 16.8, co2: 0, indoor: 1.5 }),
    show: ({ profile }) => !profile.hepa,
  },
  {
    id: 'exhaust',
    tab: 'indoor',
    slot: 'While cooking',
    slotTone: 'rose',
    title: 'Kitchen exhaust ON + kitchen window cracked while cooking',
    desc: 'Gas flames and frying push PM2.5 far above outdoor levels. Vent straight out at the source while the stove is on.',
    badges: ['Habit swap'],
    impact: (c) => ({ pm25: c.pm25 * 2.94, co2: 0, indoor: 1.5 }),
    show: ({ profile }) => profile.combustion,
  },
  {
    id: 'noIncense',
    tab: 'indoor',
    slot: 'All day',
    slotTone: 'rose',
    title: 'Skip incense, dhoop & candles on hazy days',
    desc: 'One dhoop stick can spike indoor PM2.5 for hours. Save rituals for clear-air days or use them outdoors.',
    badges: ['Free', 'Indoor source'],
    impact: () => ({ pm25: 160, co2: 0, indoor: 0.75 }),
    show: ({ profile }) => profile.combustion,
  },
  {
    id: 'mop',
    tab: 'indoor',
    slot: 'Daily',
    slotTone: 'slate',
    title: 'Wet-mop floors instead of dry sweeping',
    desc: 'Dry sweeping re-launches settled dust into the air you breathe. A damp mop traps it in the bucket.',
    badges: ['Easy'],
    impact: () => ({ pm25: 120, co2: 0, indoor: 0.5 }),
  },
  {
    id: 'vent',
    tab: 'indoor',
    slot: 'Safe Window',
    slotTone: 'emerald',
    title: 'Timed cross-ventilation during the Safe Window',
    desc: 'Open opposite windows for 10–15 minutes to flush the home, then shut again — fresh air without all-day smog load.',
    badges: ['High impact'],
    impact: (c) => ({ pm25: c.pm25 * 4.2, co2: 0, indoor: 1 }),
  },
  {
    id: 'doorCurtain',
    tab: 'indoor',
    slot: 'Peak Window',
    slotTone: 'rose',
    title: 'Hang a heavy curtain over the main door',
    desc: 'A thick curtain over the entry door creates an airlock that stops hallway and stairwell smog pouring in every time the door opens.',
    badges: ['No purifier', 'Low-cost'],
    impact: (c) => ({ pm25: c.pm25 * 1.05, co2: 0, indoor: 0.5 }),
    show: ({ profile }) => !profile.hepa,
  },

  // ---------- Tab 2: Low-emission routines ----------
  {
    id: 'shiftPlay',
    tab: 'routines',
    title: "Shift kids' outdoor play from 7:30 AM to the Safe Window",
    desc: 'Same playtime, far less inhaled PM2.5 — afternoon surface air lets the smog lift while morning inversion holds it at street level.',
    badges: ['Kid health', 'High impact'],
    impact: (c) => ({ pm25: c.pm25 * 5.4, co2: 0, indoor: 0 }),
    show: ({ habits, profile }) => habits.morningOutdoor && profile.children,
  },
  {
    id: 'walkSwap',
    tab: 'routines',
    title: 'Move the morning walk to after 10:30 AM or indoors',
    desc: 'Deep breathing during exercise multiplies how much pollution your lungs take in. Shift the route, not the habit.',
    badges: ['Adult health'],
    impact: (c) => ({ pm25: c.pm25 * 3.5, co2: 0, indoor: 0 }),
    show: ({ habits }) => habits.morningOutdoor,
  },
  {
    id: 'bundleTrips',
    tab: 'routines',
    title: 'Bundle grocery + school pickup into 1 trip (−3 short trips/wk)',
    desc: 'Cold engines pollute most in the first km. One warm round-trip replaces three cold starts.',
    badges: ['−3 trips/wk'],
    impact: (c) => ({ pm25: c.pm25 * 1.8, co2: 1.56, indoor: 0 }),
    show: ({ habits }) => habits.shortTrips,
  },
  {
    id: 'noIdle',
    tab: 'routines',
    title: 'Turn the engine off at school gates (>30 sec waits)',
    desc: 'Idling exhaust pools exactly where children line up. Engine off beyond 30 seconds protects every kid at the gate.',
    badges: ['Free', 'Community'],
    impact: (c) => ({ pm25: c.pm25 * 1.2, co2: 0.8, indoor: 0 }),
    show: ({ habits }) => habits.idling,
  },
  {
    id: 'walkShort',
    tab: 'routines',
    title: 'Walk or take the metro for trips under 2 km',
    desc: 'Short hops in the Safe Window by foot or metro cut both tailpipe CO₂ and roadside exposure.',
    badges: ['−2.4 kg CO₂/wk', 'Exercise'],
    impact: (c) => ({ pm25: c.pm25 * 1.5, co2: 2.4, indoor: 0 }),
  },
  {
    id: 'fixWindows',
    tab: 'routines',
    title: 'Close street-facing windows all morning — ventilate in the Safe Window only',
    desc: 'Balcony doors held open through the inversion peak import hours of smog. Time your fresh air instead.',
    badges: ['Free', 'High impact'],
    impact: (c) => ({ pm25: c.pm25 * 12.6, co2: 0, indoor: 0.5 }),
    show: ({ habits }) => habits.openWindows,
  },
  {
    id: 'carpool',
    tab: 'routines',
    title: 'School bus or carpool twice a week',
    desc: 'Two shared days remove 3–4 private school runs every week from the road.',
    badges: ['−1.8 kg CO₂/wk'],
    impact: (c) => ({ pm25: c.pm25 * 0.9, co2: 1.8, indoor: 0 }),
    show: ({ profile }) => profile.children,
  },
  {
    id: 'mask',
    tab: 'routines',
    title: 'N95 masks for unavoidable peak-window trips',
    desc: 'Cloth masks do not filter PM2.5. Keep fitted N95/KN95 masks for the elderly and kids when a trip cannot move.',
    badges: ['Protects sensitive lungs'],
    impact: (c) => ({ pm25: c.pm25 * 2.5, co2: 0, indoor: 0 }),
    show: ({ profile }) => profile.children || profile.elderly,
  },
];

export const INDOOR_ACTIONS = ACTIONS.filter((a) => a.tab === 'indoor');
export const ROUTINE_ACTIONS = ACTIONS.filter((a) => a.tab === 'routines');
export const FIXED_SOURCES = FIXED_PM25;
