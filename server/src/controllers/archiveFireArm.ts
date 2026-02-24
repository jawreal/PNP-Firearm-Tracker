import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";

const ArchiveFirearm = async (
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
    const result = await PoliceModel.findOne(
      { _id },
      {
        isArchived: 1,
      },
    ); // query the police model and get the isArchived field
    
    if (!result) {
      throw new Error("Failed to query the record");
    }

    const { modifiedCount, matchedCount } = await PoliceModel.updateOne(
      {
        _id,
      },
      {
        $set: {
          isArchived: !result.isArchived,
        },
      },
    );

    if (modifiedCount === 0 || matchedCount === 0) {
      throw new Error("Failed to archive the firearm record");
    }

    res.status(201).json({
      message: "Archiving firearm record success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default ArchiveFirearm;
