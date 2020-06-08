/*const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { host, port, user, pass } = require('../config/mailer.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, 
            pass: password},
  });



transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resource/mail/'),
    extName: '.html',
}));

module.exports = transport;
*/

const path = require('path')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const hbs = require('nodemailer-express-handlebars')



const { host, port, user, pass } = require('../config/mailer.json')



const transport = nodemailer.createTransport(smtpTransport({
  host, 
  port,
  auth: { user, pass }
}));



const handlebarOptions = {
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve('./src/resources/mail/auth/'),
    layoutsDir: path.resolve('./src/resources/mail/auth/'),
    defaultLayout: 'forgot_password.html',
  },

  viewPath: path.resolve('./src/resources/mail/auth/'),
  extName: '.html',
};


transport.use('compile', hbs(handlebarOptions));

module.exports = transport