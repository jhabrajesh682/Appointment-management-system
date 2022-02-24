const validate = require('../validators/captcha.validator')
const axios = require('axios');

class Captcha {
    /**
       * @function - Get all the registered users from the db
       *
       * @param - Express.req , Express.res
       *
       * @returns - List of registered users
       */

    async verifyCaptcha(req, res) {
        // throw new Error("could not create a user")

        let { error } = validate.validateCaptcha(req.body)
        if (error) {
            return res.status(400).send({
                message: "failed",
                result: error,
                status: false
            })
        }

        const secret_key = process.env.CAPTCHA_SECRET_KEY;
        const token = req.body.token;
        let postData = {
            secret: secret_key,
            response: token
        }
        // console.log(postData);

        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

        try {
            let response = await axios.post(url, postData)
            // console.log(response);

            return res.status(200).send({
                message: "captcha response",
                result: response.data, status: response.data.success
            });
        } catch (error) {
            console.log(error);

            return res.status(500).send({
                message: "captcha verification failed api error",
                status: false
            });
        }

    }


}

module.exports = Captcha;