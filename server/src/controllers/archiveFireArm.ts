import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { PoliceModel } from "@/models/policeModel";
import { AuditLogModel } from "@/models/auditModel";

const ArchiveFirearm = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    const { _id } = matchedData(req);
    const result = await PoliceModel.findOne(
      { _id },
      {
        isArchived: 1,
      },
    ); // query the police model and get the isArchived field

    if (!result) {
      throw new Error("Failed to query the record");
    }

    const firearm = await PoliceModel.findOneAndUpdate(
      {
        _id,
      },
      {
        $set: {
          isArchived: !result.isArchived,
        },
      },
      {
        new: true
      }
    );

    if (!firearm) {
      throw new Error("Failed to archive the firearm record");
    }

    await AuditLogModel.create({
      fullName,
      emailAddress,
      status: "update",
      browser: req.audit?.browser,
      ipAddress: req.audit?.ip,
      description: `**${emailAddress}** ${firearm.isArchived ? "archived" : "restored"} a firearm **${firearm.serialNumber}**`,
    }); // audit the action after registering the firearm

    res.status(201).json({
      message: "Archiving firearm record success",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default ArchiveFirearm;
