import nodemailer from "nodemailer";
import { signToken } from "./jwt";
import log from "../utils/logger";
import createError from "./createError";

const constructMsg = (
  type: "VERIFY" | "RESET",
  recipientEmail: string,
  url: string
) => {
  switch (type) {
    case "VERIFY":
      return {
        from: `Pizza App <${process.env.ETHEREAL_EMAIL}>`,
        to: `Recipient <${recipientEmail}>`,
        subject: `Verify your pizza app email`,
        text: `Please verify your account using this link: ${url}. It will expire in 1 day.`,
        html: `<p><a href=${url}>Click here</a> to verify your account. The link will expire in 1 day.</p>`,
      };
    case "RESET":
      return {
        from: `Pizza App <${process.env.ETHEREAL_EMAIL}>`,
        to: `Recipient <${recipientEmail}>`,
        subject: `Reset your pizza app password`,
        text: `Please reset your password using this link: ${url}. It will expire in 1 day.`,
        html: `<p><a href=${url}>Click here</a> to reset your password. The link will expire in 1 day.</p>`,
      };
  }
};

export const sendEmail = async (
  recipientId: string,
  recipientEmail: string,
  type: "VERIFY" | "RESET"
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_EMAIL,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  });

  const token = signToken(
    recipientId,
    "user",
    process.env.TOKEN_SECRET,
    process.env.TOKEN_TTL
  );
  const url = `${process.env.HOST}:${process.env.PORT}/api/v1/user/email/${token}`;
  const message = constructMsg(type, recipientEmail, url);

  transporter.sendMail(message, (err, info) => {
    if (err) {
      throw err;
    }

    log.info("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    log.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
};
