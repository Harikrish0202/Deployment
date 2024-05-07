const nodemailer = require("nodemailer");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  // Define mailOptions
  let mailOptions = {
    from: process.env.EMAIL_FROM, // Use EMAIL_FROM for sender email
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send email using transporter
  await transporter.sendMail(mailOptions);

  if (process.env.NODE_ENV === "production") {
    // Modify mailOptions for production environment
    mailOptions.from = {
      name: "Homly hub",
      email: process.env.EMAIL_FROM, // Use EMAIL_FROM for sender email
    };
    try {
      await sendGridMail.send(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
};

module.exports = sendEmail;
