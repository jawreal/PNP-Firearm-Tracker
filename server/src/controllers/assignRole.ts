import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { AdminModel } from "@/models/adminModel";

const AssignRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error("Invalid fields");
    }
    const { admin_id } = matchedData(req) as { admin_id: string };
    const { matchedCount, modifiedCount } = await AdminModel.updateOne(
      {
        _id: admin_id,
      },
      {
        $set: {
          role: "super-admin",
        },
      },
    );

    if (matchedCount === 0 || modifiedCount === 0) {
      throw new Error("Failed to update the account");
    }

    res.status(200).json({
      message: "Permission has been granted",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default AssignRole;
