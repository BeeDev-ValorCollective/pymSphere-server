

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
            subject: `Message Confirmation - PymSphere`,
            html:
                `
                <body style="background-color: #f7f2dd; margin: 0; padding: 0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 1000px; margin: auto;">
                        <tr style="border-bottom: 1px solid #0000000f; padding: 5px;">
                            <td>
                                <a href=${Site_Link}>
                                    <img src="https://images.pymsphere.com/logo.png" alt="Pymsphere" style="width: 200px;">
                                </a>
                            </td>
                            <td style="text-align: right;">
                                <button style="padding: 12px 24px; border-radius: 20px; width: 200px; background-color: #45999b;">
                                    <a href=${Site_Link} style="color: white; font-weight: 700; text-decoration: none;">Visit us</a>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <table>
                                    <tr>
                                        <th style="text-align: left;">Email From:  </th>
                                        <td style="text-align: left;">${mailData.userName} at ${mailData.contact}</td>
                                    </tr>
                                    <tr>
                                        <th style="text-align: left;">Subject:</th>
                                        <td style="text-align: left;">${mailData.subject}</td>
                                    </tr>
                                    <tr>
                                        <th style="text-align: left;">Message:</th>
                                        <td style="text-align: left;">${mailData.message}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2"><p>To ensure our message find their way into your inbox, please make sure to add our mailing provider <a href="#">${Email_Provider}</a> to your mailing list. </p></td>
                        </tr>
                        <tr>
                            <td colspan="2"><p>This email was intended for ${mailData.userName} (${mailData.contact}).  If you are not the intended recipient of this email, please notify the sender immediately by replying to this message and delete this email from your inbox.  Any unauthorized use, disclosure, or distribution of this email is prohibited.  Thank you for your understanding</p></td>
                        </tr>
                        <tr>
                            <td colspan="2"><p>If you wish to unsubscribe from future emails please visit <a href="#">${Unsub_Link}</a> to have your information removed</p></td>
                        </tr>
                    </table>
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