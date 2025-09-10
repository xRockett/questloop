
import nodemailer from 'nodemailer';

export async function sendVerification(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: (process.env.SMTP_USER || process.env.SMTP_PASS) ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined
  } as any);

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@questloop.local',
    to: email,
    subject: 'Your QuestLoop verification code',
    html: `<div style="font-family:Inter,system-ui,sans-serif">
      <h2>Welcome to QuestLoop!</h2>
      <p>Your verification code is:</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:4px">${code}</div>
      <p>This code expires in 15 minutes.</p>
    </div>`
  });

  return info.messageId;
}
