import { AuditLogModel } from "@/models/auditModel";
import type { Request, Response, NextFunction } from "express";

const RecentAdminAction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.isAuthenticated()) {
      throw new Error("Unauthorized!");
    }

    const result = await AuditLogModel.find({}).limit(5);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default RecentAdminAction;
