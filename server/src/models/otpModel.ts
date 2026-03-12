import { Schema, model, Document } from "mongoose";

// Note: to anyone who would check this, I did this (model based) instead of using redis.
// I didn't use redis because I'm not familliar with it that much
// and using it without enough knowledge would result to vibe coding this system
// which is not good approach

interface IOtp extends Document {
  emailAddress: string;
  code: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  emailAddress: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// TTL (Time-To-Live) index to automatically delete documents after the expiresAt time
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Otp = model<IOtp>("OTPModel", otpSchema);

export { Otp, IOtp };
