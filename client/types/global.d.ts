export {};

declare global {
  type AuditStatus = "register" | "update" | "delete" | "login" | "logout"; // For Audit log
  type FireArmStatus = "issued" | "stocked" | "loss" | "disposition"; // For Firearm record

  interface BaseInfo {
    fullName: string;
    userName: string;
    description: string;
  }
  interface DateType {
    // Type of Date
    createdAt?: string;
    updatedAt?: string;
  }

  interface IFireArm extends DateType {
    _id?: string;
    firstName: string;
    lastName: string;
    serialNumber: string;
    fireArmType: string;
    station: string;
    department: string;
    status: FireArmStatus;
  }

  interface IOpenChange {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface IAuditLog extends DateType, BaseInfo {
    status: AuditStatus;
    browser: string;
    ipAddress: string;
    registeredUserName?: string;
    recordSerialNumber?: string;
    isFireArmREcord: boolean;
  }

  interface IAdminUsers extends BaseInfo, DateType {
    role: "super-admin" | "admin";
  }
}
