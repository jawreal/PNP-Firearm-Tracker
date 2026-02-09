import type { Request, Response, NextFunction } from "express";
//import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";
//import { validationResult } from "express-validator/lib/validation-result";
import { matchedData } from "express-validator";
import SearchRecord from "@/lib/searchRecord";

const dataKeys: string[] = [
  "firstName",
  "lastName",
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

    const data = matchedData(req) as IRecordQuery;
    const result = await SearchRecord<IPolice>({
      model: PoliceModel,
      dataKeys,
      ...data,
    });
    
    const test = await PoliceModel.find({});
    console.log(test);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export default RetrieveFireArm;
