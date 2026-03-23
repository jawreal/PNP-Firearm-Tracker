import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { AdminModel } from "@/models/adminModel";
import { AuditLogModel } from "@/models/auditModel";
import mongoose from "mongoose";

const ProcessAdminStatus = async (
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
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { fullName, emailAddress, role } = req.user;
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
            ? {
                deactivatedBy: fullName,
                deactivationReason,
                deactivatedAt: Date.now(),
              }
            : { deactivationReason: "", deactivatedAt: null }), // I did this since if you activate a deactivated account, it still has this field
        },
      },
      {
        new: true,
        session,
      },
    ); // update the account and retrieve the user data

    if (!user || !req?.audit?.browser || !req?.audit?.ip) {
      throw new Error("Failed to deactivate user account");
    }

    await AuditLogModel.create(
      [
        {
          fullName,
          emailAddress,
          status: "update",
          browser: req.audit.browser,
          ipAddress: req.audit.ip,
          description: `**${emailAddress}** changed the account status of **${user?.emailAddress}** to ${status}`,
        },
      ],
      {
        session,
      },
    ); // audit the action after the update

    await session.commitTransaction();
    res.status(200).json({
      message: "Account has been deactivated",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};

export default ProcessAdminStatus;
