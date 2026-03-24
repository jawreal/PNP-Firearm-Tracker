import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";
import { AdminModel } from "@/models/adminModel";
import { AuditLogModel } from "@/models/auditModel";
import mongoose from "mongoose";

const DeleteFirearm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    }

    const { fullName, emailAddress, role } = req.user;
    if (role !== "head admin") {
      throw new Error("Only super-admin can deactivate account!");
    }
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { record_id, password } = matchedData(req);
    const user = await AdminModel.findOne({ emailAddress });
    if (!user) throw new Error();
    const isCorrect = await user.validatePassword(
      password,
      emailAddress as string,
    );
    if (!isCorrect) {
      await session.abortTransaction();
      return res.status(201).json({
        incorrectPass: true,
      });
    }

    const firearm = await PoliceModel.findOneAndDelete(
      {
        _id: record_id,
      },
      {
        session,
      },
    );

    if (!firearm || !req?.audit?.browser || !req?.audit?.ip) {
      throw new Error("Failed to delete the firearm record");
    }

    await AuditLogModel.create(
      [
        {
          fullName,
          emailAddress,
          status: "delete",
          browser: req.audit.browser,
          ipAddress: req.audit.ip,
          description: `**${emailAddress}** deleted a firearm **${firearm.serialNumber}**`,
        },
      ],
      {
        session,
      },
    ); // audit the action after deleting the firearm

    await session.commitTransaction();
    res.status(201).json({
      incorrectPass: false,
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    next(error);
  }
};

export default DeleteFirearm;
