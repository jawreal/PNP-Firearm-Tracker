import { Schema, model } from "mongoose";

type AuditStatus = "register" | "update" | "delete" | "login" | "logout" ;

interface AuditLogInfo {
  fullName: string;
  emailAddress: string;
  status: AuditStatus;
  browser: string;
  ipAddress: string;
  description: string;
  expiresAt?: Date;
}

interface IAudit extends AuditLogInfo {
  createdAt: string;
  updatedAt: string;
}

const onExpiration = (): Date => {
   const today = new Date();
   const thirtyDaysLater = new Date(today);
   thirtyDaysLater.setDate(today.getDate() + 30);
   return thirtyDaysLater;
}

const auditLogSchema = new Schema<IAudit>(
  {
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true },
    browser: { type: String, required: true },
    ipAddress: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["register", "update", "delete", "login", "logout"],
    },
    expiresAt: { type: Date, default: onExpiration() },
  },
  {
    timestamps: true,
  },
);

auditLogSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AuditLogModel = model<IAudit>("AuditLog", auditLogSchema);

export { AuditLogModel, IAudit };