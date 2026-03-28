import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const SMTP_KEY = process.env.SMTP_KEY;
const SMTP_LOGIN = process.env.SMTP_LOGIN;
console.log("SMTP KEY: ", SMTP_KEY ? "EXIST" : "MISSING")
console.log("SMTP LOGIN: ", SMTP_LOGIN ? "EXIST" : "MISSING")

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: SMTP_LOGIN,
    pass: SMTP_KEY,
  },
});

export default transporter;
