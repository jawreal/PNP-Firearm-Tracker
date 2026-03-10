import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";
import { AdminModel } from "@/models/adminModel";

const DeleteFirearm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email: string = "jorellrelleve@gmail.com"; // mock up only
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { record_id, password } = matchedData(req);
    const user = await AdminModel.findOne({ emailAddress: email });
    if (!user) throw new Error();
    const isCorrect = await user.validatePassword(password, email);
    if (!isCorrect) {
      return res.status(201).json({
        incorrectPass: true,
      });
    }

    const { acknowledged, deletedCount } = await PoliceModel.deleteOne({
      _id: record_id,
    });

    if (!acknowledged || deletedCount === 0) {
      throw new Error("Failed to delete the firearm record");
    }

    res.status(201).json({
      incorrectPass: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default DeleteFirearm;
