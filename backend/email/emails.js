import nodemailer from "nodemailer";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE(verificationToken),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome",
      html: WELCOME_EMAIL_TEMPLATE(name),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Forgot Password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE(resetURL),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};

export const sendResetSuccessEmail = async (email, resetURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE(resetURL),
    };

    const responce = await transporter.sendMail(mailOptions);
    console.log("Email sent successfuly", responce);
  } catch (error) {
    console.error(`Error sending verfication email : ${error}`);
    throw new Error(`Error sending verfication email : ${error}`);
  }
};
