
class MailModel {
    constructor({ userName, contact, subject, message }) {
        this.userName = userName
        this.contact = contact
        this.subject = subject
        this.message = message
    }
}

module.exports = MailModel