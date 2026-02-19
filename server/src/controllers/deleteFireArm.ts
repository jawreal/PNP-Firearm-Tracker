import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";

const DeleteFireArm = async (
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

    const { _id } = matchedData(req);

    const { deletedCount, acknowledged } = await PoliceModel.deleteOne({
      _id,
    });

    if (deletedCount === 0 || !acknowledged) {
      throw new Error("Failed to delete the firearm record");
    }

    res.status(201).json({
      message: "Deleting firearm record success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default DeleteFireArm;
