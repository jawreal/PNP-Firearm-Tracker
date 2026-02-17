import { AdminModel } from "@/models/adminModel";
import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

const RegisterAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Invalid fields");
    }
    const data = matchedData(req);
    await AdminModel.create(data);
    res.status(201).json({
      message: "Account has been created!",
    });
  } catch (error) {
    next(error);
  }
};

export default RegisterAdmin;
