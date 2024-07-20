const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { getConfirmEmailTemplate } = require("../utils/confirmEmail");
require("dotenv").config();
const refreshToken = process.env.GOOGLE_MAILER_REFRESH_TOKEN; // TODO create OAaut !!
const clientId = process.env.GOOGLE_MAILER_CLIENT_ID; // TODO create OAaut fro pick2 email  !!!
const clientSecret = process.env.GOOGLE_MAILER_CLIENT_SECRET; // TODO create OAaut  !!!

async function sendValidationEmail(email, token) {
  const transporter = await getTransporter();
  const validationUrl = `${process.env.FRONTEND_DOMAIN}/validate-email?token=${token}`;
  const mailOptions = getMailOptions(validationUrl, email);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

function getMailOptions(validationUrl, email) {
  const htmlContent = getConfirmEmailTemplate(validationUrl, email);
  return {
    from: "zth.one2hero.com", // TODO Replace after creating no.replay@pickup2.com email
    to: email, // TODO change with 'email' variable
    subject: "Confirm Your Email",
    html: htmlContent,
  };
}

async function getTransporter() {
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);

  oauth2Client.setCredentials({
    refresh_token: refreshToken, 
  });
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "zth.one2hero@gmail.com", // TODO replace with pickup2@
      accessToken: accessToken.token,
      clientId,
      clientSecret,
      refreshToken,
    },
  });
}

module.exports = { sendValidationEmail };
