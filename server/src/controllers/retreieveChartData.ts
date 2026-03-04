import { PoliceModel } from "@/models/policeModel";
import type { Request, Response, NextFunction } from "express";
import getMonthRange from "@/lib/getMonthRange";

const RetrieveChartData = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lastMonth = getMonthRange(-1);
    /*const lastTwoMonths = getMonthRange(-2);
    const lastThreeMonths = getMonthRange(-3);
    const lastFourMonths = getMonthRange(-4);
    const lastFiveMonths = getMonthRange(-5);
    const lastSixMonths = getMonthRange(-6);*/

    const result = await PoliceModel.aggregate([
      {
        $facet: {
          firstMonth: [
            {
              $match: {
                createdAt: {
                  $gte: lastMonth?.start,
                  $lte: lastMonth?.end,
                },
              },
            },
            { $count: "total" },
            {
              $addFields: {
                monthName: lastMonth?.monthName,
              },
            },
          ],
          secondMonth: [
            {
              $match: {
                createdAt: {
                  $gte: lastMonth?.start,
                  $lte: lastMonth?.end,
                },
              },
            },
            { $count: "total" },
            {
              $addFields: {
                monthName: lastMonth?.monthName,
              },
            },
          ],
          thirdMonth: [
            {
              $match: {
                createdAt: {
                  $gte: lastMonth?.start,
                  $lte: lastMonth?.end,
                },
              },
            },
            { $count: "total" },
            {
              $addFields: {
                monthName: lastMonth?.monthName,
              },
            },
          ],
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default RetrieveChartData;
