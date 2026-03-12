import { Otp } from "@/models/otpModel";
import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

interface ICode {
  code: string;
}

const VerfiyCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { code } = matchedData(req) as ICode; // get the code
    const result = await Otp.findOne(
      {
        code,
      },
      {
        expiresAt: 1,
        emailAddress: 1,
      },
    );

    if (!result) {
      throw new Error("code not found"); // throw error when the code is not found
    }

    if (result.expiresAt < new Date()) {
      throw new Error("code expired"); // throw error when the code already expired
    }

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export default VerfiyCode;
