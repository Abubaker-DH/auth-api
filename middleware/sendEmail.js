const sendMail = require("@sendgrid/mail");
sendMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (options) => {
  const message = {
    to: options.to, // Change to your recipient
    from: process.env.EMAIL_FROM, // Change to your verified sender
    subject: options.subject,
    text: options.text,
    // html: options.html,
  };

  sendMail
    .send(message)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
