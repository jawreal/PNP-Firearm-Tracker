import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";

const RetrieveSelectedFirearm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /*if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    } */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { _id } = matchedData(req);
    const result = await PoliceModel.findById(_id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default RetrieveSelectedFirearm;
