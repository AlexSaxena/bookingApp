import { DateTime } from "luxon";

export const TIMEZONE = "Europe/Stockholm";
export const HOUR_START = 8; // first bookable hour
export const HOUR_END = 17; // last hour (eg last slot is 16-17)
export const SLOT_MINUTES = 60;
export const DATE_FMT = "yyyy-LL-dd";

export function eachDate(fromStr: string, toStr: string): string[] {
  const out: string[] = [];
  let d = DateTime.fromFormat(fromStr, DATE_FMT, { zone: TIMEZONE }).startOf(
    "day"
  );
  const end = DateTime.fromFormat(toStr, DATE_FMT, { zone: TIMEZONE }).startOf(
    "day"
  );
  while (d <= end) {
    out.push(d.toFormat(DATE_FMT));
    d = d.plus({ days: 1 });
  }
  return out;
}

export function eachHourSlot(): number[] {
  const hrs: number[] = [];
  for (let h = HOUR_START; h < HOUR_END; h++) hrs.push(h); // 8..16
  return hrs;
}

export function toUtcSlotISO(dateStr: string, hour: number) {
  const startLocal = DateTime.fromFormat(dateStr, DATE_FMT, {
    zone: TIMEZONE,
  }).set({ hour, minute: 0, second: 0, millisecond: 0 });
  const endLocal = startLocal.plus({ minutes: SLOT_MINUTES });
  return {
    startUtc: startLocal.toUTC().toISO(),
    endUtc: endLocal.toUTC().toISO(),
  };
}

export function rangeUtcISO(fromDateStr: string, toDateStr: string) {
  const fromUtc = DateTime.fromFormat(fromDateStr, DATE_FMT, { zone: TIMEZONE })
    .startOf("day")
    .toUTC()
    .toISO();
  const toUtcExclusive = DateTime.fromFormat(toDateStr, DATE_FMT, {
    zone: TIMEZONE,
  })
    .plus({ days: 1 })
    .startOf("day")
    .toUTC()
    .toISO();
  return { fromUtc, toUtcExclusive };
}
