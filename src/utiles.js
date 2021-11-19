const nodemailer = require("nodemailer");

/* Mail Transport */
export let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MAIL_TRANSPORT}`,
    pass: `${process.env.MAIL_PASSWORD}`,
  },
});
