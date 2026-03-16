import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";
import { AdminModel } from "@/models/adminModel";
import { AuditLogModel } from "@/models/auditModel";

const DeleteFirearm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    }

    const fullName = req.user?.fullName;
    const emailAddress = req.user?.emailAddress;
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
      return res.status(201).json({
        incorrectPass: true,
      });
    }

    const firearm = await PoliceModel.findOneAndDelete({
      _id: record_id,
    });

    if (!firearm) {
      throw new Error("Failed to delete the firearm record");
    }

    await AuditLogModel.create({
      fullName,
      emailAddress,
      status: "delete",
      browser: req.audit?.browser,
      ipAddress: req.audit?.ip,
      description: `**${emailAddress}** deleted a firearm **${firearm.serialNumber}**`,
    }); // audit the action after deleting the firearm

    res.status(201).json({
      incorrectPass: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default DeleteFirearm;
