import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";

const addFireArm = async (req: Request, res: Response, next: NextFunction) => {
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

    const data = matchedData(req) as IPolice;
    await PoliceModel.create(data); // Insert data in database
    res.status(201).json({
      message: "Adding firearm success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default addFireArm;
