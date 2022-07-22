import nodemailer from "nodemailer";
import { signToken } from "./jwt";
import log from "../utils/logger";
import createError from "./createError";

const constructMsg = (
  type: "VERIFY" | "RESET",
  recipientEmail: string,
  token: string
) => {
  switch (type) {
    case "VERIFY":
      const verifyUrl = `${process.env.HOST}:${process.env.PORT}/api/v1/user/verify/email/${token}`;
      return {
        from: `Pizza App <${process.env.ETHEREAL_EMAIL}>`,
        to: `Recipient <${recipientEmail}>`,
        subject: `Verify your pizza app email`,
        text: `Please verify your account using this link: ${verifyUrl}. It will expire in 1 day.`,
        html: `<p><a href=${verifyUrl}>Click here</a> to verify your account. The link will expire in 1 day.</p>`,
      };
    case "RESET":
      // FIXME: change host to client host
      const resetUrl = `${process.env.HOST}:${process.env.PORT}/api/v1/auth/reset-pass/${token}`;
      return {
        from: `Pizza App <${process.env.ETHEREAL_EMAIL}>`,
        to: `Recipient <${recipientEmail}>`,
        subject: `Reset your pizza app password`,
        text: `Please reset your password using this link: ${resetUrl}. It will expire in 1 day.`,
        html: `<p><a href=${resetUrl}>Click here</a> to reset your password. The link will expire in 1 day.</p>`,
      };
  }
};

export const sendEmail = (
  recipientId: string,
  recipientEmail: string,
  type: "VERIFY" | "RESET"
) => {
  const email = process.env.ETHEREAL_EMAIL;
  const password = process.env.ETHEREAL_PASSWORD;

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: email,
      pass: password,
    },
  });

  const token = signToken(
    recipientId,
    "user",
    process.env.TOKEN_SECRET,
    process.env.TOKEN_TTL
  );
  const message = constructMsg(type, recipientEmail, token);

  transporter.sendMail(message, (err, info) => {
    if (err) throw err;

    if (process.env.NODE_ENV !== "production") {
      log.info("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      log.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  });
};
