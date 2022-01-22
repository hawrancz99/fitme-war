"use strict";
const nodemailer = require("nodemailer");

// eslint-disable-next-line import/prefer-default-export
export async function sendMail(
  to,
  type,
  firstName = "",
  lastName = "",
  newPassword = null,
  customObject = null
) {
  const mailOptions = {
    from: process.env.MAIL,
    to,
    subject: "",
    text: "",
  };

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_FROM,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  switch (type) {
    case "userRegistration":
      mailOptions.subject = "Fit.me registrace";
      mailOptions.text = `Dobrý den ${firstName} ${lastName}, vítejte v aplikaci Fit.me. Děkujeme a hurá cvičit! `;
      break;
    case "trainerRegistration":
      mailOptions.subject = "Fit.me registrace";
      mailOptions.text = `Dobrý den ${firstName} ${lastName}, vítejte v aplikaci Fit.me. Děkujeme za registraci! `;
      break;
    case "groundRegistration":
      mailOptions.subject = "Fit.me registrace";
      mailOptions.text = `Dobrý den, vítejte v aplikaci Fit.me. Děkujeme za registraci vašeho sportoviště ${firstName}! Na odkazu http://dev.frontend.team06.vse.handson.pro/login se nyní můžete přihlásit do aplikace.`;
      break;
    case "lostPassword":
      mailOptions.subject = "Fit.me obnova hesla";
      mailOptions.html = `Vážený zákazníku,<br/><br/>pro změnu zapomenutého hesla prosím přejděte na link níže.<br/><br/><a href="${customObject.link}">${customObject.link}</a><br/><br/>Vaše Fit.me`;
      break;
    case "reservationCreated":
      mailOptions.subject = "Fit.me obnova hesla";
      mailOptions.text = `Dobrý den ${firstName} ${lastName}, právě jste zažádal/a o obnovu hesla. Vaše nové heslo je: ${newPassword}. Po přihlášení okamžitě toto heslo změnte. Děkujeme. `;
      break;
    case "reservationCanceledByUser":
      mailOptions.subject = "Fit.me obnova hesla";
      mailOptions.text = `Dobrý den ${firstName} ${lastName}, právě jste zažádal/a o obnovu hesla. Vaše nové heslo je: ${newPassword}. Po přihlášení okamžitě toto heslo změnte. Děkujeme. `;
      break;
    case "reservationCanceledByTrainer":
      mailOptions.subject = "Fit.me obnova hesla";
      mailOptions.text = `Dobrý den ${firstName} ${lastName}, právě jste zažádal/a o obnovu hesla. Vaše nové heslo je: ${newPassword}. Po přihlášení okamžitě toto heslo změnte. Děkujeme. `;
      break;
    case "reservationCanceledByGround":
      mailOptions.subject = "Fit.me obnova hesla";
      mailOptions.text = `Dobrý den ${firstName} ${lastName}, právě jste zažádal/a o obnovu hesla. Vaše nové heslo je: ${newPassword}. Po přihlášení okamžitě toto heslo změnte. Děkujeme. `;
      break;
    default:
      console.log("Něco se pokazilo při posílání mailu :)");
  }
  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
}
