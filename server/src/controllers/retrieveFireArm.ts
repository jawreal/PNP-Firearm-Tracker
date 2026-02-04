import type { Request, Response, NextFunction } from "express";
//import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";

const RetrieveFireArm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    }
    const data = await PoliceModel.find();
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

export default RetrieveFireArm;
