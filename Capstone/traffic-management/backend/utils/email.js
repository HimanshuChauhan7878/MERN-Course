const nodemailer = require("nodemailer");

// Create transporter; fall back to stream transport for local dev
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // Dev fallback that just logs emails
  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const transporter = createTransporter();

exports.sendBillEmail = async ({ to, subject, html }) => {
  const from = process.env.SMTP_FROM || "no-reply@billing-app.com";

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("Email payload:", info.message);
  }

  return info;
};
