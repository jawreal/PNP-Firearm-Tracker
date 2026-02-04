import { Schema, model } from "mongoose";

type AuditStatus = "register" | "update" | "delete" | "login" | "logout" ;

interface AuditLogInfo {
  fullName: string;
  userName: string;
  status: AuditStatus;
  browser: string;
  ipAddress: string;
  description: string;
  registeredUserName?: string;
  recordSerialNumber?: string;
  isFireArmREcord: boolean;
}

interface IAudit extends AuditLogInfo {
  createdAt: string;
  updatedAt: string;
}

const auditLogSchema = new Schema<IAudit>(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    browser: { type: String, required: true },
    ipAddress: { type: String, required: true },
    description: { type: String, required: true },
    registeredUserName: { type: String, required: false },
    recordSerialNumber: { type: String, required: false },
    isFireArmREcord: { type: Boolean, required: false, default: false },
    status: {
      type: String,
      required: true,
      enum: ["register", "update", "delete"],
    },
  },
  {
    timestamps: true,
  },
);

const AuditLogModel = model<IAudit>("AuditLog", auditLogSchema);

export { AuditLogModel };
