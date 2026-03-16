import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { AdminModel } from "@/models/adminModel";
import { AuditLogModel } from "@/models/auditModel";

const AssignRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.isAuthenticated() || !req?.user) {
      throw new Error("Unauthorized!");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Invalid fields");
    }

    const deactivatedBy = req.user?.fullName;
    const emailAddress = req.user?.emailAddress;
    const { admin_id } = matchedData(req) as { admin_id: string };
    const user = await AdminModel.findOneAndUpdate(
      {
        _id: admin_id,
      },
      {
        $set: {
          role: "super-admin",
        },
      },
      {
        new: true,
      },
    );

    if (!user) {
      throw new Error("Failed to update the account");
    }

    await AuditLogModel.create({
      fullName: deactivatedBy,
      emailAddress,
      status: "update",
      browser: req.audit?.browser,
      ipAddress: req.audit?.ip,
      description: `**${emailAddress}** changed **${user?.emailAddress}** account role to head admin`,
      isFireArmRecord: false,
    }); // audit the action after updating the role

    res.status(200).json({
      message: "Permission has been granted",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default AssignRole;
