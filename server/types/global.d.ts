import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      // for accesing user in req.user
      _id?: Types.ObjectId;
      emailAddress?: string;
      status?: string;
      createdAt?: string;
      deactivationReason?: string;
      role?: "super-admin" | "admin";
    }
  }
  
  interface IRecordQuery {
    // for search record query
    search: string;
    filter: string;
    page: number;
  }
}

export {};
