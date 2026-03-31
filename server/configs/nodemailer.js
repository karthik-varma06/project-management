import nodemailer from "nodemailer";

// Create transporter (Brevo SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // must be false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email function
const sendEmail = async (to, subject, body) => {
  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: body,
    });

    return response;
  } catch (error) {
    console.log("Email Error:", error);
    throw error;
  }
};

export default sendEmail;