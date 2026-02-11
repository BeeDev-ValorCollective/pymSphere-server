

const nodemailer = require('nodemailer')
const MailModel = require('../models/mail.model')
const Site_Link = process.env.SITE_LINK
const Unsub_Link = process.env.UNSUB_LINK
const Email_Provider = process.env.CONTACT_EMAIL_USER


const sendContactMail = async (req, res) => {
    const { userName, contact, subject, message } = req.body
    
    const mailData = new MailModel({ userName, contact, subject, message })

    try {
        if (!process.env.EMAIL_HOST || !process.env.CONTACT_EMAIL_USER || !process.env.CONTACT_EMAIL_PASS) {
            return res.status(500).json({ message: "Server email config missing" });
}
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.CONTACT_EMAIL_USER,
                pass: process.env.CONTACT_EMAIL_PASS,
            },
            logger: true,
            debug: true
        })

        const bccList = [];
        if (mailData.contact && mailData.contact.includes("@")) bccList.push(mailData.contact)

        const mailOptions = {
            from: process.env.CONTACT_EMAIL_USER,
            to: process.env.CONTACT_EMAIL_USER,
            bcc: bccList.length ? bccList : undefined,
            subject: `Testing Mail Server from ${mailData.userName}`,
            html:
                `
                <body>
                    <h1>This just a test</h1>
                    <p>We are testing the contact form on the site.  Feel free to ignore this email</p>
                    <a href=${Site_Link}>Pymsphere</a>
                    <table>
                        <tr>
                            <th>Email From:</th>
                            <td>${mailData.userName} at ${mailData.contact}</td>
                        </tr>
                        <tr>
                            <th>Subject</th>
                            <td>${mailData.subject}</td>
                        </tr>
                        <tr>
                            <th>Message</th>
                            <td>${mailData.message}</td>
                        </tr>
                    </table>
                    <p>To ensure our message find their way into your inbox, please make sure to add our mailing provider <a href="#">${Email_Provider}</a> to your mailing list. </p>
                    <p>This email was intended for ${mailData.userName} (${mailData.contact}).  If you are not the intended recipient of this email, please notify the sender immediately by replying to this message and delete this email from your inbox.  Any unauthorized use, disclosure, or distribution of this email is prohibited.  Thank you for your understanding</p>
                    <p>If you wish to unsubscribe from future emails please visit <a href="#">${Unsub_Link}</a> to have your information removed</p>
                </body>
                `
        }
        await transporter.sendMail(mailOptions)
        console.log(mailData)
        return res.status(200).json({message: "Sent", info: mailData})
    } catch(error) {
        console.error("Failed", error)
        return res.status(500).json({message: "Failed"})
    }
}

module.exports = { sendContactMail }