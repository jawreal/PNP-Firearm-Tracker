export {} 

declare global {
  type FireArmStatus = "active" | "inactive"; 
  interface IFireArm {
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
}