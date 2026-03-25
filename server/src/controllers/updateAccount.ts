import { AdminModel } from "@/models/adminModel";
import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import mongoose from "mongoose";

interface IUserInfo {
  admin_id: string;
  emailAddress: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UpdateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (!req.isAuthenticated() || !req?.user?.emailAddress) {
      throw new Error("Unauthorized!");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const {
      admin_id,
      oldPassword,
      newPassword,
      confirmPassword,
      emailAddress,
    } = matchedData(req) as IUserInfo; // get the code

    if (oldPassword) {
      const user = await AdminModel.findOne({
        _id: admin_id,
      }); // find user first
      if (!user) throw new Error("User not found");
      const isCorrect = await user.validatePassword(
        oldPassword,
        req.user.emailAddress,
      ); // validate user password

      if (!isCorrect) {
        // check if the passoword is correct, abort transaction if incorrect
        await session.abortTransaction();
        console.log("Update acc: incorrect password");
        return res.status(403).json({
          incorrectPass: true,
        });
      }
    }

    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        throw new Error("New password doesn't match confirm password");
      }
    }

    const { matchedCount, modifiedCount } = await AdminModel.updateOne(
      {
        _id: admin_id,
      },
      {
        $set: {
          ...(emailAddress ? { emailAddress } : {}),
          ...(newPassword ? { password: newPassword } : {}),
        },
      },
      {
        session,
      },
    );
    if (matchedCount === 0 || modifiedCount === 0) {
      throw new Error("Failed to update user's info");
    }

    await session.commitTransaction();
    res.status(201).json({
      message: "Info has been updated",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};

export default UpdateAccount;
