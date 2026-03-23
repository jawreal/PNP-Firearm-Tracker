import { AuditLogModel } from "@/models/auditModel";
import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

const Logout = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized");
    }
    const browser = req.audit?.browser;
    const ipAddress = req.audit?.ip;

    if (!browser || !ipAddress) {
      throw new Error("No device info found");
    }

    const { fullName, emailAddress } = req.user;
    req.session.destroy(async (err: Error) => {
      if (err) {
        console.log("Couldn't destroy the session");
        next(err);
        return;
      }

      await AuditLogModel.create(
        [
          {
            fullName,
            emailAddress,
            status: "logout",
            browser,
            ipAddress,
            description: `**${emailAddress}** has logged out`,
          },
        ],
        {
          session,
        },
      );

      await session.commitTransaction();
      res.clearCookie("connect.sid");
      res.status(200).send("Signout");
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  }
};

export default Logout;
