import type { Request, Response, NextFunction } from "express";
import { matchedData, validationResult } from "express-validator";
import { AdminModel } from "@/models/adminModel";
import dotenv from "dotenv";
dotenv.config();

interface IAuth {
  token: string;
  emailAddress: string;
  password: string;
}

const UserLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      throw new Error("Invalid fields");
    }

    const TURNSTILE_SECRET = process.env.SECRET_KEY; // get the secret key
    const { token, emailAddress, password } = matchedData(req) as IAuth; // destructure the fields
    const user = await AdminModel.findOne({ emailAddress }); // find the user first
    if (!user) throw new Error(); // throw error if not found
    const isCorrect = await user.validatePassword(password, emailAddress); // validate
    if (!isCorrect) {
      // return fields as json and set the incorrectPass as true
      return res.status(201).json({
        incorrectPass: true,
      });
    }

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
    ); // verify the token

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      console.error("Turnstile failed:", verifyData["error-codes"]);
      return res
        .status(400)
        .json({ error: "Bot check failed. Please try again." });
    }

    // needs to authenticate the user using passport here for session purposes
    res.status(200).json({
      incorrectPass: false,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default UserLogin;
