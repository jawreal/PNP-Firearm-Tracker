export {};

declare global {
  type AuditStatus = "register" | "update" | "delete" | "login" | "logout"; // For Audit log
  type FireArmStatus = "issued" | "stocked" | "loss" | "disposition"; // For Firearm record
  type AdminAccStatus = "active" | "deactivated";

  interface BaseInfo {
    fullName: string;
    userName: string;
    firstName: string;
    lastName: string;
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
    fireArmType: string;
    station: string;
    department: string;
    status: FireArmStatus;
  }

  interface IOpenChange {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  }

  interface IAuditLog
    extends DateType, Omit<BaseInfo, "firstName" | "lastName"> {
    // Doesn't need firstName and lastName
    status: AuditStatus;
    browser: string;
    ipAddress: string;
    registeredUserName?: string;
    recordSerialNumber?: string;
    isFireArmREcord: boolean;
  }

  interface IAdminUsers extends BaseInfo, DateType {
    role: "super-admin" | "admin";
    status: AdminAccStatus;
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
  }

  interface ITableRender {
    // for table render
    dataLength: number;
    isLoading: boolean;
    error: Error | null;
    search: string;
  }
}
