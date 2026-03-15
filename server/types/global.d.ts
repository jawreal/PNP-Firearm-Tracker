import { Types } from "mongoose";

declare global {
  interface BaseInfo {
    _id?: Types.ObjectId; 
    fullName?: string;
    emailAddress?: string;
    status?: string;
    createdAt?: string;
    deactivationReason?: string;
    deactivatedBy?: string;
    deactivatedAt?: Date | null;
    role?: "super-admin" | "admin";
  }
  
  namespace Express {
    interface User extends BaseInfo {} // for accesing user in req.user 
  }
  
  interface IRecordQuery {
    // for search record query
    search: string;
    filter: string;
    page: number;
  }
}

export {};
