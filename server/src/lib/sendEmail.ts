import dotenv from "dotenv";
dotenv.config();
import brevo from "@/config/brevoClient";

interface ISendEmail {
  emailAddress: string;
  htmlContent: string;
}

const sendEmail = async ({
  emailAddress, 
  htmlContent, 
}: ISendEmail) => {
  const response = await brevo.transactionalEmails.sendTransacEmail({
    subject: "Password Reset Request — CSJDM PNP Logistics",
    htmlContent,
    sender: { name: "CSJDM PNP - Logistics", email: process.env.DEV_EMAIL! }, // developer email
    to: [{ email: emailAddress }],
  });
  return response;
};

export default sendEmail;