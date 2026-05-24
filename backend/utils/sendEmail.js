// src/utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text, html }) => {
  // Use environment variables for credentials
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT || 587),
        secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || "App"}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });

    return info;
};
