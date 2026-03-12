import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import crypto from "crypto";
import { Otp } from "@/models/otpModel";
import transporter from "@/config/emailTransporter";

const ForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const { emailAddress } = matchedData(req) as { emailAddress: string };
    const otpCode: string = crypto.randomInt(100000, 999999).toString(); // generate OTP code
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // 5 min;
    await Otp.create({ emailAddress, code: otpCode, expiresAt });

    const resetLink = `https://localhost:5173/auth/new-password/${otpCode}`; // for dev

    await transporter.sendMail({
      from: '"CSJDM PNP - Logistics" <csjdmpnp_logistics@gmail.com>',
      to: emailAddress,
      subject: "Password Reset Request — CSJDM PNP Logistics",
      html: `
    <p>Hello,</p>
    <p>We received a request to reset your password for the <strong>CSJDM PNP Logistics Management System</strong>.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset my password</a>
    <p>This link will expire in <strong>5 minutes</strong>.</p>
    <p>If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>
    <br/>
    <small>City of San Jose Del Monte Police Station · Logistics Department</small>`,
    });

    res.status(201).json({
      message: "Email sent succesfully",
    });
  } catch (error) {
    next(error);
  }
};

export default ForgotPassword;
