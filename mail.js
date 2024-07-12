require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "betsy55@ethereal.email",
    pass: process.env.ETHPASSWORD,
  },
});

async function sendEmail(sender, text) {
  let content = text.reduce(function(a, b) {
    return a + '<li>' + "Product: " + b.name + '</br><br>' + "Price: $" + `<s>${b.price}</s>` + `<b> $${b.changed_price}</b>` + '</br><br>' + `<a href=${b.url}><img style=" max-width: 30vh" src=${b.image} alt="Product image"></a>` + '</br></li>';
  }, '');
    try {
        const info = await transporter.sendMail({
        from: '"Betsy Muller" <betsy55@ethereal.email>', // sender address
        to: `${sender}`, // list of receivers
        subject: "🚨 Price Drop Alert❗ 🚨", // Subject line
        text: `${content}`, // plain text body
        html: `<h3>These items are on sale today:</h3> 
        <ol style="display: flex; flex-direction: column; gap: 1em;">
          ${content}
        </ol>
        `, // html body
        });
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log(err)
    }
  }

module.exports = sendEmail;
  