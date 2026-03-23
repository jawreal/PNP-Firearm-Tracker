import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";
import { AuditLogModel } from "@/models/auditModel";
import mongoose from "mongoose";

interface UpdatedFireArm extends IPolice {
  firearm_id: string;
}

const UpdateFireArm = async (
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

    const { fullName, emailAddress } = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }
    /* ---------- error validation (end) ---------- */

    const { firearm_id, serialNumber, ...rest } = matchedData(
      req,
    ) as UpdatedFireArm;

    if (serialNumber) {
      const result = await PoliceModel.find({
        serialNumber: serialNumber,
      });

      if (result?.length > 0) {
        return res.status(400).json({
          message: "Firearm already exist",
        });
      }
    }

    const firearm = await PoliceModel.findOneAndUpdate(
      {
        _id: firearm_id,
      },
      {
        $set: {
          ...(serialNumber ? { serialNumber } : {}),
          ...rest,
        },
      },
      {
        new: true,
        session,
      },
    );

    if (!firearm || !req?.audit?.browser || !req?.audit?.ip) {
      throw new Error(
        "Failed to update firearm record. Record not found or no changes made.",
      );
    }

    await AuditLogModel.create(
      [
        {
          fullName,
          emailAddress,
          status: "update",
          browser: req.audit.browser,
          ipAddress: req.audit.ip,
          description: `**${emailAddress}** updated a firearm **${firearm.serialNumber}**`,
        },
      ],
      {
        session,
      },
    ); // audit the action after updating firearm

    await session.commitTransaction();
    res.status(201).json({
      message: "Updating firearm success",
    });
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    next(error);
  }
};

export default UpdateFireArm;
