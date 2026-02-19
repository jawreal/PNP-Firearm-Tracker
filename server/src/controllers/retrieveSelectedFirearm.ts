import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";
import { Types } from "mongoose";

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
    const qr_id = new Types.ObjectId(String(_id));
    const result = await PoliceModel.findOne(
      {
        _id: qr_id,
      },
      {
        _id: 0,
        fullName: 1,
        serialNumber: 1,
        department: 1,
        station: 1,
        status: 1,
        fireArmType: 1,
        createdAt: 1,
      },
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default RetrieveSelectedFirearm;
