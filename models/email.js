const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const KEYS = require('../config/keys.json');


const oauth2Client = new OAuth2(
  KEYS["google-client-id"],
  KEYS["google-client-secret"],
  "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
     refresh_token: KEYS["refresh-token"]
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: "maia.posternack22@trinityschoolnyc.org",
          clientId:  KEYS["google-client-id"],
          clientSecret:KEYS["google-client-secret"],
          refreshToken: KEYS["refresh-token"],
          accessToken: accessToken
     }
});

tls: {
  rejectUnauthorized: false
}

exports.sendEmail = function(email) {

  const mailInfo = {
       from: "maia.posternack22@trinityschoolnyc.org",
       to: email,
       subject: "test",
       generateTextFromHTML: true,
       html: "<b>is this thing on?</b>"
  };

  smtpTransport.sendMail(mailInfo, (error, response) => {
       error ? console.log(error) : console.log(response);
       smtpTransport.close();
  });

}

exports.sendReminder = function(username,email,id,current,amount,name) {

  const mailInfo = {
       from: "maia.posternack22@trinityschoolnyc.org",
       to: email,
       subject: "RoundTable Payment Reminder",
       generateTextFromHTML: true,
       html: "Hello "
       + username +
       ", <br> This is a reminder to pay back "
       + current +
       " for your <a href='https://trin-roundtable.herokuapp.com/event/"
       + id+
       "/past' >"
       + name +
       " </a>. You owe them $"
       + amount +
       ". <br> Thanks! <br> RoundTable"
  };

  smtpTransport.sendMail(mailInfo, (error, response) => {
       error ? console.log(error) : console.log(response);
       smtpTransport.close();
  });

}


exports.sendDispute = function(email,name, desc, price, reason,event_name) {

  const mailInfo = {
       from: "maia.posternack22@trinityschoolnyc.org",
       to: email,
       subject: "RoundTable Transaction Dispute",
       generateTextFromHTML: true,
       html: "Hello, <br> This is a notification that "
       + name +
       " is disputing your purchase of "
       + desc +
       " for $"
       + price +
       " because '"
       + reason +
       "'. Please resolve this dispute in your event: "
       + event_name +
       ". Thanks! <br> RoundTable"



  };

  smtpTransport.sendMail(mailInfo, (error, response) => {
       error ? console.log(error) : console.log(response);
       smtpTransport.close();
  });

}
