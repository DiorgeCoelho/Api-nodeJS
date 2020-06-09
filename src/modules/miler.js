const path = require('path');
const nodemailer = require('nodemailer');
const {host, port, user, pass} = require('../config/mail.json');

const hbs = require('nodemailer-express-handlebars');


const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });

const handlebarOptions = {
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/resources/mail/')
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.html'
};
  
  transport.use('compile', hbs(handlebarOptions));

  module.exports = transport;