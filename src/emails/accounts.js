const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name)=> {
  sgMail.send({
    to: email,
    from: 'winston.lim.cher.hong@gmail.com',
    subject:'Thank you for joining the app',
    text: `Welcome to the app, ${name}. Let me know your valuable feedback`,
  })
}
const sendExitEmail = (email, name)=> {
  sgMail.send({
    to: email,
    from: 'winston.lim.cher.hong@gmail.com',
    subject:'We are sorry you\'re leaving',
    text: `Let us know how we can improve and better suit your needs`,
  })
}


module.exports = {
  sendWelcomeEmail,
  sendExitEmail,
}