export {};

declare global {
  type FireArmStatus = "issued" | "stocked" | "loss" | "disposition";
  interface IFireArm {
    _id?: string;
    firstName: string;
    lastName: string;
    serialNumber: string;
    fireArmType: string;
    station: string;
    department: string;
    status: FireArmStatus;
    createdAt?: string;
    updatedAt?: string;
  }

  interface IOpenChange {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  }
}
