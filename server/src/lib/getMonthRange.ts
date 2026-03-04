export default function getMonthRange(monthOffset: number = 0) {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);

  const monthName = start.toLocaleString("en-US", {
    month: "short",
  });

  return { start, end, monthName };
}
