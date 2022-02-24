require('dotenv').config();
const app = require('./app/server');
const db = require('./app/startup/db');
const {} = require('./app/services/Reminder.service');
const {} = require('./app/services/NoShow.service');
//const timezone='America/Los_Angeles'

const { info } = require('./app/utils/chalk');
const https = require('https');
const fs = require('fs');
const { http } = require('winston');

const port = process.env.PORT;
console.log(new Date());
// console.log('email service--------->',emailService('Asia/Kolkata'));

let https_options = {
  key: fs.readFileSync('certificate/stemzglobal.com.key'),

  cert: fs.readFileSync('certificate/1adb0e2b9c6c2d5d.crt'),

  ca: [
    fs.readFileSync('certificate/1adb0e2b9c6c2d5d.pem'),

    fs.readFileSync('certificate/gd_bundle-g2-g1.crt'),
  ],
};

// const sever = https.createServer(https_options, app).listen(port, () => {
//   db();
//   emailService('Asia/Kolkata');

//   noShow();
//   console.log(info('Server started on port ' + port));
// });

app.listen(port, () => {
  db();
  emailService('Asia/Kolkata');

  noShow();
  console.log(info('Server started on port ' + port));
});
