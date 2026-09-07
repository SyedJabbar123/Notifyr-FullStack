import transporter from "../config/email.js";
import env from "../config/env.js";

export async function sendVerificationEmail(toEmail, token) {
  const link = `${env.FRONTEND_URL}/verify-email/${token}`;
  try {
    await transporter.sendMail({
      from: `Notifyr <${env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Verify your Notifyr account",
      html: `
        <p>Welcome to Notifyr!</p>
        <p>Click the link below to verify your email and activate your account:</p>
        <p><a href="${link}">${link}</a></p>
        <p>This link expires in 30 minutes.</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }
}

export async function sendPasswordResetEmail(toEmail, token) {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
  try {
    await transporter.sendMail({
      from: `Notifyr <${env.GMAIL_USER}>`,
      to: toEmail,
      subject: "Reset your Notifyr password",
      html: `
        <p>We received a request to reset your Notifyr password.</p>
        <p><a href="${link}">${link}</a></p>
        <p>This link expires in 30 minutes. If you didn't request this, you can ignore this email.</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err.message);
  }
}
