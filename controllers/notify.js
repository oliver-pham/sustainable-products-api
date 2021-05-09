require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function notify(destination, subject, message) {
    const msg = {
      to: destination,
      from: process.env.SENDGRID_SENDER,
      subject: subject,
      text: message,
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };

    sgMail.send(msg).then(
      () => {},
      (error) => {
        console.error(error);

        if (error.response) {
          console.error(error.response.body);
        }
      }
    );
};
/*
const sg = require("sendgrid")(process.env.SENDGRID_API_KEY);
const helper = require("sendgrid").mail;

function notify(destination, subject, message) {
    const sender = new helper.Email(process.env.SENDGRID_SENDER);
    const to = new helper
    const recipient = new helper.Email(destination);
    const content = new helper.Content("text/html", message);
    const mail = new helper.Mail(sender, subject, recipient, content);

    const req = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: mail.toJSON(),
    });

    sg.API(req, function (err, res) {
      console.log(res.statusCode);
      console.log(res.body);
      console.log(res.headers);
    });
};
*/
module.exports = notify;