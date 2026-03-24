import type { LucideIcon } from "lucide-react";

export {};

declare global {
  type AuditStatus = "register" | "update" | "delete" | "login" | "logout"; // For Audit log
  type FireArmStatus =
    | "issued"
    | "stocked"
    | "loss"
    | "disposition"
    | "turn in"; // For Firearm record
  type AdminAccStatus = "active" | "deactivated";

  interface BaseInfo {
    fullName: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    addedBy: string;
    description: string;
  }

  interface DateType {
    // Type of Date
    createdAt?: string;
    updatedAt?: string;
  }

  interface IFireArm extends DateType {
    // Needs fistName and LastName for issued to info
    fullName: string;
    _id?: string;
    serialNumber: string;
    fireArmType: "long" | "short";
    fireArmMake: string;
    station: string;
    department: string;
    status: FireArmStatus;
    isArchived: boolean;
  }

  interface IOpenChange {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface IAuditLog
    extends DateType, Omit<BaseInfo, "firstName" | "lastName" | "addedBy"> {
    // Doesn't need firstName, lastName, and added by
    _id: string;
    status: AuditStatus;
    browser: string;
    ipAddress: string;
    registeredUserEmail?: string;
    recordSerialNumber?: string;
  }

  interface IAdminUsers extends Omit<BaseInfo, "description">, DateType {
    _id: string;
    role: "head admin" | "admin";
    status: AdminAccStatus;
    deactivatedBy?: string;
    deactivatedAt?: string;
    deactivationReason?: string;
  }

  interface IRegisterAdmin extends Omit<BaseInfo, "fullName" | "description"> {
    password: string;
    confirmPassword: string;
  }

  type SortFireArm =
    | keyof Omit<IFireArm, "_id" | "createdAt" | "updatedAt">
    | "Sort by";

  interface RecordQuery<T> {
    // for useFetchData
    record: T[];
    hasNextPage: boolean;
    totalPages: number;
    statistics: Record<string, number>[];
  }

  interface ITableRender {
    // for table render
    dataLength: number;
    isLoading: boolean;
    error: Error | null;
    search: string;
  }

  interface StatsType {
    title: string;
    icon: LucideIcon;
    additionalDetail: string;
  } // for statistic type

  interface RefHandle {
    export: () => void;
    openRegister: () => void;
  } // for firearm table

  interface ISelectedRange {
    from?: Date;
    to?: Date; // for date range picker
  }

  type IAtiveFields = keyof ISelectedRange; // for active fields in date range picker
}
