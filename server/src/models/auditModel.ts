import { Schema, model } from "mongoose";

type AuditStatus = "register" | "update" | "delete" | "login" | "logout" ;

interface AuditLogInfo {
  fullName: string;
  emailAddress: string;
  status: AuditStatus;
  browser: string;
  ipAddress: string;
  description: string;
  registeredUserEmail?: string;
  recordSerialNumber?: string;
  isFireArmRecord: boolean;
}

interface IAudit extends AuditLogInfo {
  createdAt: string;
  updatedAt: string;
}

const auditLogSchema = new Schema<IAudit>(
  {
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    browser: { type: String, required: true },
    ipAddress: { type: String, required: true },
    description: { type: String, required: true },
    registeredUserEmail: { type: String, required: false },
    recordSerialNumber: { type: String, required: false },
    isFireArmRecord: { type: Boolean, required: false, default: false },
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
