import { Sunrise, Sun, CloudSun, Moon, type LucideIcon } from 'lucide-react';

export type Risk = 'low' | 'moderate' | 'high' | 'severe';

export interface Scenario {
  id: string;
  label: string;
  aqi: number;
  pm25: number;
  pm10: number;
  peakWindow: string;
  safeWindow: string;
  explainer: string;
  slotRisk: Risk[];
  slotAction: string[];
}

export const PRESETS: Scenario[] = [
  {
    id: 'severe',
    label: 'Severe Morning Smog',
    aqi: 340,
    pm25: 185,
    pm10: 290,
    peakWindow: '6:00 AM – 10:30 AM',
    safeWindow: '1:30 PM – 4:30 PM',
    explainer:
      'Cold morning ground air traps vehicle exhaust and dust close to street level until midday sunlight warms the surface.',
    slotRisk: ['severe', 'high', 'low', 'moderate'],
    slotAction: [
      'Keep everyone indoors — skip the morning walk; windows stay shut.',
      'Seal door gaps and run the clean-air room; the peak lingers until 10:30 AM.',
      'Cross-ventilate 1:30 – 4:30 PM and let kids play outdoors now.',
      'Close up by 5 PM, run the kitchen exhaust while cooking, skip incense.',
    ],
  },
  {
    id: 'moderate',
    label: 'Moderate Evening Haze',
    aqi: 165,
    pm25: 88,
    pm10: 145,
    peakWindow: '7:00 PM – 11:00 PM',
    safeWindow: '12:00 PM – 4:00 PM',
    explainer:
      'Pollution builds through the day and settles as evening air cools, so haze peaks after sunset and clears by late morning.',
    slotRisk: ['low', 'low', 'moderate', 'high'],
    slotAction: [
      'Air is cleanest now — a morning walk with windows open is fine.',
      'Great ventilation window — cross-ventilate every room.',
      'Finish outdoor play, errands and laundry before evening haze builds.',
      'Peak window: shut windows, avoid balcony time, engine off at school gates.',
    ],
  },
  {
    id: 'clear',
    label: 'Clear Afternoon Breeze',
    aqi: 82,
    pm25: 34,
    pm10: 68,
    peakWindow: 'None',
    safeWindow: '11:00 AM – 5:00 PM',
    explainer:
      'A mild breeze and warm surface air are lifting pollutants away today — a good day to ventilate and reset the home.',
    slotRisk: ['low', 'low', 'low', 'low'],
    slotAction: [
      'Enjoy outdoors — ideal conditions for morning activity.',
      'Deep-clean, dust and wash bedding while the air is clean.',
      'Wide safe window — ventilate the whole home thoroughly.',
      'Evening strolls are safe; keep normal routines.',
    ],
  },
];

export interface LiveResult {
  aqi: number;
  pm25: number;
  pm10: number;
}

export function buildLiveScenario(city: string, r: LiveResult): Scenario {
  const base =
    r.aqi >= 200 ? PRESETS[0] : r.aqi >= 100 ? PRESETS[1] : PRESETS[2];
  return {
    ...base,
    id: 'live',
    label: `Live · ${city}`,
    aqi: r.aqi,
    pm25: r.pm25,
    pm10: r.pm10,
    explainer: `${base.explainer} This reading came in live from the Open-Meteo air-quality network for ${city}.`,
  };
}

export const CITIES = [
  { name: 'Delhi NCR', lat: 28.6139, lon: 77.209 },
  { name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
  { name: 'Mumbai', lat: 19.076, lon: 72.8777 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'Hyderabad', lat: 17.385, lon: 78.4867 },
] as const;

export interface Profile {
  children: boolean;
  elderly: boolean;
  hepa: boolean;
  combustion: boolean;
}

export interface Habits {
  morningOutdoor: boolean;
  shortTrips: boolean;
  idling: boolean;
  openWindows: boolean;
}

export const DEFAULT_PROFILE: Profile = {
  children: true,
  elderly: true,
  hepa: false,
  combustion: true,
};

export const DEFAULT_HABITS: Habits = {
  morningOutdoor: true,
  shortTrips: true,
  idling: true,
  openWindows: true,
};

export const DEFAULT_CHECKED = ['seal', 'exhaust', 'vent', 'shiftPlay', 'walkShort'];

export const TIME_SLOTS: {
  name: string;
  time: string;
  icon: LucideIcon;
}[] = [
  { name: 'Early Morning', time: '6:00 – 10:00 AM', icon: Sunrise },
  { name: 'Midday', time: '10:00 AM – 1:00 PM', icon: Sun },
  { name: 'Afternoon', time: '1:00 – 5:00 PM', icon: CloudSun },
  { name: 'Evening', time: '5:00 – 10:00 PM', icon: Moon },
];

export function aqiLevel(aqi: number) {
  if (aqi >= 300)
    return {
      name: 'Severe',
      text: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      ring: 'ring-rose-200',
    };
  if (aqi >= 200)
    return {
      name: 'Very Poor',
      text: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      dot: 'bg-rose-400',
      ring: 'ring-rose-200',
    };
  if (aqi >= 100)
    return {
      name: 'Moderate',
      text: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      ring: 'ring-amber-200',
    };
  return {
    name: 'Satisfactory',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
  };
}

export function riskStyle(risk: Risk) {
  switch (risk) {
    case 'severe':
      return {
        label: 'Severe outdoor risk',
        card: 'bg-rose-50 border-rose-300',
        dot: 'bg-rose-500',
        text: 'text-rose-700',
      };
    case 'high':
      return {
        label: 'High outdoor risk',
        card: 'bg-orange-50 border-orange-300',
        dot: 'bg-orange-500',
        text: 'text-orange-700',
      };
    case 'moderate':
      return {
        label: 'Moderate outdoor risk',
        card: 'bg-amber-50 border-amber-300',
        dot: 'bg-amber-500',
        text: 'text-amber-700',
      };
    default:
      return {
        label: 'Low outdoor risk',
        card: 'bg-emerald-50 border-emerald-300',
        dot: 'bg-emerald-500',
        text: 'text-emerald-700',
      };
  }
}
