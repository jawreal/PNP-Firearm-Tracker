import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";
import { AuditLogModel } from "@/models/auditModel";
import mongoose from "mongoose";

const AddFireArm = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction(); // start transaction
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
      // check if authenticated
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
      // check for invalid fields
    }

    const { fullName, emailAddress } = req.user;
    const data = matchedData(req) as IPolice;
    const result = await PoliceModel.find({
      serialNumber: data.serialNumber,
    });

    if (result?.length > 0) {
      await session.commitTransaction();
      return res.status(400).json({
        message: "Firearm already exist",
      });
      // send a mesasge if firearm already exist
    }

    if (!req.audit?.browser || !req?.audit?.ip) {
      throw new Error("No device info found");
      // throw error if no device info found
    }

    await PoliceModel.create([data], { session }); // Insert data in database. Data must be wrapped with [] when using session.
    await AuditLogModel.create(
      [
        {
          fullName,
          emailAddress,
          status: "register",
          browser: req.audit.browser,
          ipAddress: req.audit.ip,
          description: `**${emailAddress}** registered a firearm **${data.serialNumber}**`,
        },
      ],
      { session },
    ); // audit the action after registering the firearm

    await session.commitTransaction(); // commmit transaction if no error
    res.status(201).json({
      message: "Adding firearm success",
    });
  } catch (error) {
    await session.abortTransaction(); // abort transaction if errors
    console.log(error);
    next(error);
  }
};

export default AddFireArm;
