import type { Request, Response, NextFunction } from "express";
//import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";
//import { validationResult } from "express-validator/lib/validation-result";
import { matchedData } from "express-validator";
import SearchRecord from "@/lib/searchRecord";
import NormalizeStat from "@/lib/normalizeStats";

interface IRetrieveFireArm extends IRecordQuery {
  recordType: "active" | "archive";
  from?: Date;
  to?: Date;
}

const DATA_KEYS: string[] = [
  "fullName",
  "serialNumber",
  "fireArmType",
  "station",
  "department",
  "status",
];

const RetrieveFireArm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /*if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }*/
    const { recordType, from, to, ...rest } = matchedData(
      req,
    ) as IRetrieveFireArm;
    const statistics = await PoliceModel.aggregate([
      {
        $match: {
          isArchived: recordType !== "active",
        },
      },
      {
        $facet: {
          totalTurnIn: [
            {
              $match: {
                status: "turn in",
              },
            },
            { $count: "value" },
          ],
          totalIssued: [
            {
              $match: {
                status: "issued",
              },
            },
            { $count: "value" },
          ],
          totalStocked: [
            {
              $match: {
                status: "stocked",
              },
            },
            { $count: "value" },
          ],
          totalLoss: [
            {
              $match: {
                status: "loss",
              },
            },
            { $count: "value" },
          ],
          totalDisposition: [
            {
              $match: {
                status: "disposition",
              },
            },
            { $count: "value" },
          ],
        },
      },
    ]);
    console.log("From: ", from);
    console.log("To: ", to);
    const normalized_data = NormalizeStat(statistics);
    const extraFilters = {
      isArchived: recordType !== "active",
      ...(from && to
        ? {
            createdAt: {
              $gt: from,
              $lte: to,
            },
          }
        : {}),
    };

    const result = await SearchRecord<IPolice>({
      model: PoliceModel,
      dataKeys: DATA_KEYS,
      extraFilters,
      ...rest,
    });

    res.status(201).json({
      ...result,
      statistics: normalized_data,
    });
  } catch (err) {
    next(err);
  }
};

export default RetrieveFireArm;
