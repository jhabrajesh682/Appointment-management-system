const nodemailer = require("nodemailer");
// const MailingCred = {
//     email: process.env.MAIL_EMAIL,
//     password: process.env.MAIL_PASSWORD,
// }
const emaildetail = process.env.MAIL_EMAIL
const passwordetail = process.env.MAIL_PASSWORD

module.exports = async (x) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: false,
        port: 587,
        auth: {
            user: emaildetail,
            pass: passwordetail
        }
    });
    // console.log(MailingCred);

    transporter.sendMail({
        from: '"QMS" <' + emaildetail + '>',
        to: x.email,
        subject: x.subject,
        html: x.body
    }, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            //console.log(info);
            console.log("mail send");

            // res.status(200).send({ message: "mail send" });
        }
    });

};