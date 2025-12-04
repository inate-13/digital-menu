import nodemailer from "nodemailer";

export function createGmailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL env vars missing");
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendOtpEmail(to: string, code: string) {
  const transporter = createGmailTransporter();
  const mail = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Your verification code",
    text: `Your verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  };
  const info = await transporter.sendMail(mail);
  console.log("Email sent:", info.messageId);
  return info;
}
