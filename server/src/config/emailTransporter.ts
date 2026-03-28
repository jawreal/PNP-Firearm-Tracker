import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const isDeployed: boolean = process.env.NODE_ENV === "production"; 
const APP_PASS = process.env.APP_PASS;
const DEV_EMAIL = process.env.DEV_EMAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: isDeployed ? 565 : 465,
  secure: !isDeployed,
  auth: {
    user: DEV_EMAIL,
    pass: APP_PASS,
  },
});

export default transporter;
