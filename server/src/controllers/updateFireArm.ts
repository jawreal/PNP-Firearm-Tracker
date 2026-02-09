import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";

interface UpdatedFireArm extends IPolice {
  firearm_id: string;
}

const UpdateFireArm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    /* ---------- error validation (start) ---------- 
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    }*/
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }
    /* ---------- error validation (end) ---------- */

    const { firearm_id, ...rest } = matchedData(req) as UpdatedFireArm;
    const { matchedCount, modifiedCount } = await PoliceModel.updateOne(
      {
        _id: firearm_id,
      },
      {
        $set: {
          ...rest,
        },
      },
    );
    if (matchedCount === 0 || modifiedCount === 0) {
      throw new Error("Failed to update firearm record. Record not found or no changes made.");
    }
    res.status(201).json({
      message: "Updating firearm success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default UpdateFireArm;
