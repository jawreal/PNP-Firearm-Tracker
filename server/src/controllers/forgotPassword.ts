import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import crypto from "crypto";
import { Otp } from "@/models/otpModel";
import transporter from "@/config/emailTransporter";
import { AdminModel } from "@/models/adminModel";

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
    const user = await AdminModel.findOne({
      emailAddress,
    });

    if (user && user?.status !== "active") {
      // send this when the user status is no longer active
      await transporter.sendMail({
        from: '"CSJDM PNP - Logistics" <csjdmpnp_logistics@gmail.com>',
        to: emailAddress,
        subject: "Password Reset Request — CSJDM PNP Logistics",
        html: ` 
    <p>Hello,</p>
    <p>We would like to inform you that your account on the <strong>CSJDM PNP Logistics Management System</strong> has been <strong>deactivated</strong>.</p>
    <p>Because your account is currently inactive, you are <strong>unable to update or reset your password</strong> at this time.</p>
    <p>If you believe this was done in error or you would like to have your account reactivated, please contact your system administrator or the Logistics Department directly.</p>
    <p>If you did not request this or have no concerns, you may safely disregard this message.</p>
    <br/>
    <small>City of San Jose Del Monte Police Station · Logistics Department</small>`,
      });
      return res.status(201).json({
        message: "Email sent succesfully",
      });
    }

    const otpCode: string = crypto.randomInt(100000, 999999).toString(); // generate OTP code
    const expiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // 5 min;
    await Otp.create({ emailAddress, code: otpCode, expiresAt });

    const resetLink = `http://localhost:5173/auth/update/password/${otpCode}`; // for dev

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
