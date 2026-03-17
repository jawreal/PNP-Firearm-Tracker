import type { Request, Response, NextFunction } from "express";
//import { matchedData, validationResult } from "express-validator";
//import { validationResult } from "express-validator/lib/validation-result";
import { AuditLogModel, type IAudit } from "@/models/auditModel";
import { matchedData, validationResult } from "express-validator";
import SearchRecord from "@/lib/searchRecord";

const dataKeys: string[] = [
 "fullName",
  "emailAddress",
  "status",
  "createdAt",
  "browser",
  "ipAddress",
  "description",
];

const RetrieveAuditLog = async (
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
    
    const data = matchedData(req) as IRecordQuery;
    const result = await SearchRecord<IAudit>({
      model: AuditLogModel,
      dataKeys,
      ...data
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export default RetrieveAuditLog;