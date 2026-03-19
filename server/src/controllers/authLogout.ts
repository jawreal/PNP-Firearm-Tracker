import { AuditLogModel } from "@/models/auditModel";
import type { Request, Response, NextFunction } from "express";

const Logout = (req: Request, res: Response, next: NextFunction) => {
  const fullName = req?.user?.fullName;
  const emailAddress = req?.user?.emailAddress;
  const browser = req.audit?.browser;
  const ipAddress = req.audit?.ip;

  req.session.destroy(async (err: Error) => {
    if (err) {
      console.log("Couldn't destroy the session");
      next(err);
      return;
    }

    await AuditLogModel.create({
      fullName,
      emailAddress,
      status: "logout",
      browser,
      ipAddress,
      description: `**${emailAddress}** has logged out`,
    });

    res.clearCookie("connect.sid");
    res.status(200).send("Signout");
  });
};

export default Logout;
