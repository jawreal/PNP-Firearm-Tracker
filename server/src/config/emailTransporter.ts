import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const APP_PASS = process.env.APP_PASS;
const DEV_EMAIL = process.env.DEV_EMAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: DEV_EMAIL,
    pass: APP_PASS,
  },
});

export default transporter;
