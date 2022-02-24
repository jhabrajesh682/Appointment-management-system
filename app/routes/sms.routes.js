const router = require("express").Router();
const Sms = require("../controllers/smsTemplate.controller")

// middleware
const auth = require('../middlewares/auth')//[auth]
const admin = require('../middlewares/admin')//[auth,admin],

const sms = new Sms();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", sms.getAllSmsTemplate);
router.post("/", sms.createSmsTemplate);



router.get("/:id", sms.getOneSmsTemplate)

router.put("/:id", sms.getOneSmsTemplateAndUpdate)

router.delete("/:id", sms.getOneSmsTemplateAndRemove)




module.exports = router;