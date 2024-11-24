import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ toMail, subject, body, fromEmail }) => {
  try {
    const info = await transporter.sendMail({
      from: fromEmail,
      to: toMail,
      subject,
      html: body,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

app.post("/email", async (req, res) => {
  try {
    const { subject, body, fromEmail } = req.body;

    const toMail = "varunsannapureddy@gmail.com";

    if (!subject || !body || !fromEmail) {
      return res.status(400).json({ error: "Subject, body, and fromEmail are required" });
    }

    await sendEmail({ toMail, subject, body, fromEmail });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
