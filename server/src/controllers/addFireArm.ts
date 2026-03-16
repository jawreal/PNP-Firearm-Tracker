import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel, type IPolice } from "@/models/policeModel";
import { AuditLogModel } from "@/models/auditModel";

const AddFireArm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const fullName = req.user?.fullName;
    const emailAddress = req.user?.emailAddress;
    const data = matchedData(req) as IPolice;
    const result = await PoliceModel.find({
      serialNumber: data?.serialNumber,
    });

    if (result?.length > 0) {
      return res.status(400).json({
        message: "Firearm already exist",
      });
    }

    const firearm = await PoliceModel.create(data); // Insert data in database
   
    await AuditLogModel.create({
      fullName,
      emailAddress,
      status: "register",
      browser: req.audit?.browser,
      ipAddress: req.audit?.ip,
      description: `**${emailAddress}** registered a firearm **${firearm.serialNumber}**`,
    }); // audit the action after registering the firearm
   
    res.status(201).json({
      message: "Adding firearm success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default AddFireArm;
