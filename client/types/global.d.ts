export {};

declare global {
  type AuditStatus = "register" | "update" | "delete"; // For Audit log
  type FireArmStatus = "issued" | "stocked" | "loss" | "disposition"; // For Firearm record

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

  interface AuditLogInf extends DateType {
    fullName: string;
    userName: string;
    status: AuditStatus;
    description: string;
    device: string;
  }
}
