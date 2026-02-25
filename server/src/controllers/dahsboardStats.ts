import type { Request, Response, NextFunction } from "express";
import { PoliceModel } from "@/models/policeModel";
import { AdminModel } from "@/models/adminModel";
import NormalizeStat from "@/lib/normalizeStats";

const DashboardStats = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // for firearms record
    const firearmResult = await PoliceModel.aggregate([
      {
        $facet: {
          totalActive: [
            {
              $match: {
                isArchived: false,
              },
            },
            { $count: "value" },
          ],
          totalArchive: [
            {
              $match: {
                isArchived: true,
              },
            },
            {
              $count: "value",
            },
          ],
        },
      },
    ]);

    const adminResult = await AdminModel.aggregate([
      {
        $facet: {
          totalActiveAcc: [
            {
              $match: {
                status: "active",
              },
            },
            { $count: "value" },
          ],
          totalDeactivatedAcc: [
            {
              $match: {
                isArchived: false,
              },
            },
            { $count: "value" },
          ],
        },
      },
    ]);

    const normalizedFirearm = NormalizeStat(firearmResult);
    const normalizedAdmin = NormalizeStat(adminResult);

    const normalizedData = [...normalizedFirearm, ...normalizedAdmin];
    res.status(201).json({
      statistics: normalizedData,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default DashboardStats;
