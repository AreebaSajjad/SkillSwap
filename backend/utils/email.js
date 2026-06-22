const nodemailer = require('nodemailer');

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const transport = getTransporter();
    const mailOptions = {
      from: `"SkillSwap 🚀" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    return await transport.sendMail(mailOptions);
  } catch (err) {
    console.log('Email send failed (non-critical):', err.message);
  }
};
