import { AdminModel } from "@/models/adminModel";
import { AuditLogModel } from "@/models/auditModel";
import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";

const RegisterAdmin = async (
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
      throw new Error("Invalid fields");
    }

    const fullName = req.user?.fullName;
    const emailAddress = req.user?.emailAddress;
    const data = matchedData(req);
    const finalizedData = {
      addedBy: fullName, // only for testing
      ...data
    }
    const user = await AdminModel.create(finalizedData);

    await AuditLogModel.create({
      fullName,
      emailAddress,
      status: "register",
      browser: req.audit?.browser,
      ipAddress: req.audit?.ip,
      addedBy: `**${emailAddress}** registered an account **${user?.emailAddress}** as admin`,
      isFireArmRecord: false,
    }); // audit the action after the added account

    res.status(201).json({
      message: "Account has been created!",
    });
  } catch (error) {
    next(error);
  }
};

export default RegisterAdmin;
