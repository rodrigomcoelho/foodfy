const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport(
  {
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "08b569c895e0fb",
      pass: "fbd60801123164"
    }
  });
