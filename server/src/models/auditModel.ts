import { Schema, model } from "mongoose";

type AuditStatus = "register" | "update" | "delete";

interface AuditLogInfo {
  fullName: string;
  userName: string;
  status: AuditStatus;
  description: string;
  device: string;
}

interface IAudit extends AuditLogInfo {
  createdAt: string;
  updatedAt: string;
}

const auditLogSchema = new Schema<IAudit>(
  {
    fullName: { type: String, required: true },
    userName: { type: String, required: true },
    description: { type: String, required: true },
    device: { type: String, required: true },
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
