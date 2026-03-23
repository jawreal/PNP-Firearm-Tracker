import { AdminModel } from "@/models/adminModel";
import { AuditLogModel } from "@/models/auditModel";
import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import mongoose from "mongoose";

const RegisterAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (!req.isAuthenticated() || !req?.user) {
      throw new Error("Unauthorized!");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Invalid fields");
    }

    const { fullName, emailAddress } = req.user;
    const data = matchedData(req);
    const finalizedData = {
      addedBy: fullName, // only for testing
      ...data,
    };

    const user = await AdminModel.create([finalizedData], {
      session,
    });

    if (!user || !req?.audit?.browser || !req?.audit?.ip) {
      throw new Error("Failed to registered admin or no device found");
    }

    await AuditLogModel.create(
      [
        {
          fullName,
          emailAddress,
          status: "register",
          browser: req.audit?.browser,
          ipAddress: req.audit?.ip,
          description: `**${emailAddress}** registered an account **${user[0]?.emailAddress}** as admin`,
        },
      ],
      { session },
    ); // audit the action after the added account

    await session.commitTransaction();
    res.status(201).json({
      message: "Account has been created!",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};

export default RegisterAdmin;
