import type { MonthRange } from "@/lib/getMonthRange";

const NormalizeMonthRange = (
  data: Record<string, Record<string, number>[]>[],
  months: Record<string, MonthRange>,
) => {
  return Object.keys(months)?.map((key: string) => {
    const field = data[0][key][0]; // the field (e.g., { firstMonth: 1 })
    const value = field ? data[0][key][0][key] : 0; // checks the key then gets the value
    const month = months[key]?.monthName ?? "Unknown";
    return { registered: value, month };
  }).reverse();
};

export default NormalizeMonthRange;
