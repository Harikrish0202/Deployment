const nodemailer = require("nodemailer");
const sendGridMail = require("@sendgrid/mail");

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
  let mailOptions = {
    from: "test@test.com", // Sender email
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  if (process.env.NODE_ENV === "production") {
    // Modify mailOptions for production environment
    mailOptions.from = {
      name: "Deployment",
      email: process.env.SENDGRID_EMAIL,
    };
    // Send email using SendGrid
    try {
      console.log(mailOptions);
      await sendGridMail.send(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  } else {
    // Create a transporter for non-production environment
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
  }
};

module.exports = sendEmail;
