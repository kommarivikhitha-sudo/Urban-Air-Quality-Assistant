import type { FamilyAction } from '../data/actions';

export interface ImpactTotals {
  pm25: number;
  co2: number;
  indoor: number;
}

export function computeImpact(
  actions: FamilyAction[],
  checked: Set<string>,
  pm25: number,
): ImpactTotals {
  let pm25Total = 0;
  let co2 = 0;
  let indoor = 0;
  for (const a of actions) {
    if (!checked.has(a.id)) continue;
    const r = a.impact({ pm25 });
    pm25Total += r.pm25;
    co2 += r.co2;
    indoor += r.indoor;
  }
  return {
    pm25: Math.round(pm25Total),
    co2: Math.round(co2 * 10) / 10,
    indoor: Math.round(indoor * 10) / 10,
  };
}
