const router = require("express").Router();
const Captcha = require("../controllers/Captcha.controller")


const captcha = new Captcha();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.post("/verify",captcha.verifyCaptcha);

module.exports = router;