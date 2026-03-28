import dotenv from "dotenv";
dotenv.config();
import { BrevoClient } from "@getbrevo/brevo";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
console.log("BREVO API KEY: ", BREVO_API_KEY ? "EXIST" : "MISSING");

const brevo = new BrevoClient({
  apiKey: BREVO_API_KEY,
});

export default brevo;