import { AdminModel } from "@/models/adminModel";
import { Otp } from "@/models/otpModel";
import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

interface IVerify {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

const UpdatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { code, newPassword, confirmPassword } = matchedData(req) as IVerify; // get the code
    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        incorrectPass: true,
      }); // check if password match
    }

    const result = await Otp.findOne(
      {
        code,
      },
      {
        expiresAt: 1,
        emailAddress: 1,
      },
    ); // query the code

    if (!result) {
      return res.status(201).json({
        codeError: true,
      }); // send a code error field when no code found
    }

    if (result.expiresAt < new Date()) {
      return res.status(201).json({
        codeError: true,
      }); // send a code error field when code is already expired
    }

    await AdminModel.updateOne(
      {
        emailAddress: result.emailAddress,
      },
      {
        $set: {
          password: newPassword, // no need to encrypt this manually since i set an auto encryption method in the model itself
        },
      },
    );

    res.status(201).json({
      codeError: false,
    });
  } catch (error) {
    next(error);
  }
};

export default UpdatePassword;
