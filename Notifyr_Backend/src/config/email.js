import nodemailer from "nodemailer";
import env from "./env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_APP_PASSWORD, // app password, NOT the regular account password
  },
});

export default transporter;
