// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer'); 

//nodemailer
const sendEmail = async (options)=> {
    // 1-Create a transporter service that will send email like (Gmail, mailgun, etc.)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST, // Replace with your SMTP host
        port: process.env.EMAIL_PORT, // if secure false port is 587, true port is 465
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Your email address
            pass: process.env.EMAIL_PASSWORD // Your email password or app password
        }

    });
    // 2- Define the email options like (from, to, subject, text, html)
    const mailOpts = {
        from: 'E-shop App <mohamedibrateams@gmail.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    };
    // 3- Send the email using the transporter service
    await transporter.sendMail(mailOpts);
};

module.exports = sendEmail;