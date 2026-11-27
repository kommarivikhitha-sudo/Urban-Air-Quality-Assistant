# VayuCare — Urban Air Quality Assistant

Helping families navigate winter smog through practical low-emission routines, indoor air hacks, and clear impact insights.

---

## The Problem
During winter months, temperature inversions trap vehicle exhaust, construction dust, and household smoke close to street level—creating severe morning and evening smog spikes. Most air quality apps only display an AQI number, leaving parents, children, and elderly family members without clear, practical guidance on when to ventilate, how to protect indoor air without expensive equipment, or how small daily routine changes cut exposure and local emissions.

## What VayuCare Does
VayuCare translates local air quality conditions into an actionable daily plan tailored to each household:

1. Real-Time & Scenario-Based Air Context
   - Supports live air quality data via the Open-Meteo Air Quality API alongside 3 instant winter smog presets (Severe Morning Smog, Moderate Evening Haze, and Clear Afternoon Breeze).
   - Highlights Peak Smog Windows, Safe Ventilation Windows, and a plain-language explanation of winter inversion conditions.

2. Household-Tailored Recommendations
   - Adapts advice based on household needs (Young Children, Elderly / Asthma-Sensitive Members, HEPA Air Purifier Availability, and Gas Stove / Incense Use) and current habits.
   - Prioritizes zero-cost and low-cost hacks (such as damp-cloth draft stoppers, timed cross-ventilation, wet mopping, and clean-air bedroom zoning) when a purifier is unavailable.

3. Three Interactive Action Views
   - Indoor Air Hacks: Time-slotted home checklist (Peak Window, While Cooking, Safe Window, Night) to keep indoor air cleaner.
   - Low-Emission Routines: Practical daily swaps—shifting outdoor play to safer afternoon windows, bundling short vehicle errands, cutting school-gate idling, and walking/using metro for trips under 2 km.
   - Day Timeline Planner: Four-block daily schedule (Early Morning, Midday, Afternoon, Evening) showing outdoor risk levels and the single best family move for each time slot.

4. Transparent Impact Insights
   - Dynamically calculates PM2.5 Exposure Avoided ($\mu\text{g/m}^3\cdot\text{hrs/week}$), Tailpipe $\text{CO}_2$ Saved ($\text{kg/week}$), and Clean Indoor Air Gained ($\text{hours/day}$) as users toggle actions, with an expandable breakdown of all formulas used.

---

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS, Lucide React
- Air Quality Data: Open-Meteo Air Quality API + deterministic winter smog scenario presets
- Deployment: Bolt / GitHub / Netlify

---

## Running Locally
```bash
npm install
npm run dev
