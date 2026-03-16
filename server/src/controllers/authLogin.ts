import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import passport from "passport";
import dotenv from "dotenv";
import { AuditLogModel } from "@/models/auditModel";
dotenv.config();

interface IAuth extends BaseInfo {
  token: string;
}

const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const TURNSTILE_SECRET = process.env.SECRET_KEY; // get the secret key
    const { token } = matchedData(req) as Pick<IAuth, "token">; // get token
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET,
          response: token,
          // Optional: pass user's IP for extra security
          // remoteip: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        }),
      },
    ); // process the token first

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      // validate the token
      console.error("Turnstile failed:", verifyData["error-codes"]);
      return res
        .status(400)
        .json({ error: "Bot check failed. Please try again." });
    }

    passport.authenticate(
      "local",
      async (
        err: Error,
        user: Partial<Omit<IAuth, "token">> | false,
        _next: NextFunction,
      ) => {
        console.log("Error in authentication: ", err);
        if (err) {
          return next(err);
        }

        if (!user) {
          // this means incorrect credentials
          return res.status(201).json({
            incorrectPass: true,
          });
        }

        if (user?.status !== "active") {
          return res.json({
            user: {
              status: "deactivated",
              deactivatedBy: user?.deactivatedBy,
              deactivationReason: user?.deactivationReason,
              deactivatedAt: user?.deactivatedAt,
            },
          });
        }

        await AuditLogModel.create({
          fullName: user.fullName,
          emailAddress: user.emailAddress,
          status: "login",
          browser: req.audit?.browser,
          ipAddress: req.audit?.ip,
          description: `**${user.emailAddress}** has logged in to the system`,
        }); // audit the action after the added account

        // authenticate user
        req.login(user, async (err) => {
          if (err) return res.status(500).json({ message: "Login error" });

          return res.status(200).json({
            incorrectPass: false,
            user,
            message: "Signed in successfully",
          });
        });
      },
    )(req, res, next);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default UserLogin;
