const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email , name) => {
    sgMail.send({
        to : email,
        from : 'hazemyasser6@gmail.com',
        subject : 'Welcome to the app',
        text : `welcome to the app , ${name}. Let me know how you get along with the app`,
        
        // html : '<button>Hit Me</button>'
    })
}

const sendCancelEmail = (email , name) => {
    sgMail.send({
        to : email, 
        from : 'hazemyasser6@gmail.com',
        subject : 'sorry to see you go 😢😢',
        text : `we are very sad that you are going to leave us ${name}. we would like to know why you wasn't pleased with us`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}