import { PoliceModel } from "@/models/policeModel";
import type { Request, Response, NextFunction } from "express";
import { getMonthRange, type MonthRange } from "@/lib/getMonthRange";
import NormalizeMonthRange from "@/lib/normalizedMotnRange";

const months: Record<string, MonthRange> = {
  firstMonth: getMonthRange(0),
  secondMonth: getMonthRange(-1),
  thirdMonth: getMonthRange(-2),
  fourthMonth: getMonthRange(-3),
  fifthMonth: getMonthRange(-4),
  sixthMonth: getMonthRange(-5),
};

const RetrieveChartData = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const firstMonth = months.firstMonth.monthName;
    const lastMonth = months.sixthMonth.monthName;
    const currentYear = new Date().getFullYear();

    const pipeLines = Object.fromEntries(
      Object.keys(months).map((key: string) => {
        const selectedMonth = months[key];

        return [
          key,
          [
            {
              $match: {
                createdAt: {
                  $gte: selectedMonth?.start,
                  $lte: selectedMonth?.end,
                },
              },
            },
            { $count: key },
          ],
        ];
      }),
    );

    const result = await PoliceModel.aggregate([
      {
        $facet: {
          ...pipeLines,
        },
      },
    ]);

    res.status(200).json({
      chartStat: NormalizeMonthRange(result, months),
      startAndEnd: `${lastMonth} - ${firstMonth} ${currentYear}`,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default RetrieveChartData;
