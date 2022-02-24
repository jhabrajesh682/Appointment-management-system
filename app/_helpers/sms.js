const request = require("request");
const urlencode = require("urlencode");
const axios = require("axios");

class SMS {
  async loginOtp(otp, number) {
    let promise = new Promise((resolve, reject) => {
      let msg = "Login to VIN using this OTP : " + urlencode(otp);
      let apiKey = urlencode("5aUEetOhSn4-vM7hnZkfHiDHq0nYwxyo7GEY8xYCG3");
      let toNumber = urlencode(number);
      let sender = urlencode("DYNAPT");
      let data =
        "apikey=" +
        apiKey +
        "&numbers=" +
        toNumber +
        "&message=" +
        msg +
        "&sender=" +
        sender;

      // console.log(data);
      let uri = "https://api.textlocal.in/send?" + data;

      axios
        .get(uri)
        .then((x) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
          // console.log("error:", error); // Print the error if one occurred
          // console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
          // console.log("body:", body); // Print the HTML for the Google homepage.
        });
    });

    return promise;
  }
}

module.exports = SMS;
