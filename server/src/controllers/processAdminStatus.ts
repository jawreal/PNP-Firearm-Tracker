import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { AdminModel } from "@/models/adminModel";

const ProcessAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { status, role, admin_id, deactivationReason } = matchedData(req);
    if (role !== "super-admin") {
      throw new Error("Only super-admin can deactivate account!");
    }

    const { matchedCount, modifiedCount } = await AdminModel.updateOne(
      {
        _id: admin_id,
      },
      {
        $set: {
          status,
          ...(status !== "activate" ? { deactivationReason } : {}),
        },
      },
    );

    if (matchedCount === 0 || modifiedCount === 0) {
      throw new Error("Failed to deactivate user account");
    }

    res.status(200).json({
      message: "Account has been deactivated",
    });
  } catch (error) {
    next(error);
  }
};

export default ProcessAdminStatus;
