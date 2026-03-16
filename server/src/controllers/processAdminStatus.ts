import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { AdminModel } from "@/models/adminModel";
import { AuditLogModel } from "@/models/auditModel";

const ProcessAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.isAuthenticated() || !req?.user) {
      throw new Error("Unauthorized!");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }
    const role = req.user?.role ?? "super-admin"; // set as super-admin in development
    const deactivatedBy = req.user?.fullName;
    const emailAddress = req.user?.emailAddress;

    const { status, admin_id, deactivationReason } = matchedData(req);
    console.log(status);
    if (role !== "super-admin") {
      throw new Error("Only super-admin can deactivate account!");
    }

    const user = await AdminModel.findOneAndUpdate(
      {
        _id: admin_id,
      },
      {
        $set: {
          status,
          ...(status !== "active"
            ? { deactivatedBy, deactivationReason, deactivatedAt: Date.now() }
            : { deactivationReason: "", deactivatedAt: null }), // I did this since if you activate a deactivated account, it still has this field
        },
      },
      {
        new: true,
      },
    ); // update the account and retrieve the user data

    if (!user) {
      throw new Error("Failed to deactivate user account");
    }

    
    await AuditLogModel.create({
      fullName: deactivatedBy,
      emailAddress,
      status: "update",
      browser: req.audit?.browser,
      ipAddress: req.audit?.ip,
      description: `**${emailAddress}** changed the account status of **${user?.emailAddress}** to ${status}`,
      isFireArmRecord: false,
    }); // audit the action after the update

    res.status(200).json({
      message: "Account has been deactivated",
    });
  } catch (error) {
    next(error);
  }
};

export default ProcessAdminStatus;
