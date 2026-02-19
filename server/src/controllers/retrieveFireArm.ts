import type { Request, Response, NextFunction } from "express";
//import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";
//import { validationResult } from "express-validator/lib/validation-result";
import { matchedData } from "express-validator";
import SearchRecord from "@/lib/searchRecord";

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

    const statistics = await PoliceModel.aggregate([
      {
        $facet: {
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

    const normalized_data = Object.keys(statistics[0]).map((stat) => {
      const value = statistics[0][stat][0]?.value;
      return { [stat]: value ?? 0 };
    });

    const data = matchedData(req) as IRecordQuery;
    const result = await SearchRecord<IPolice>({
      model: PoliceModel,
      dataKeys: DATA_KEYS,
      ...data,
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
