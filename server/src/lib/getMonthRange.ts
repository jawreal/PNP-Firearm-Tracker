interface MonthRange {
  start: Date;
  end: Date;
  monthName: string;
}

function getMonthRange(monthOffset: number = 0): MonthRange {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + monthOffset + 1, 1);

  const monthName = start.toLocaleString("en-US", {
    month: "short",
  });

  return { start, end, monthName };
}

export { getMonthRange, MonthRange };
