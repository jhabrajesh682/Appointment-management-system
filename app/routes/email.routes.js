const router = require("express").Router();
const Email = require("../controllers/email.controller")

// middleware
const auth = require('../middlewares/auth')//[auth]
const admin = require('../middlewares/admin')//[auth,admin],

const email = new Email();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", email.getAllEmailTemplate);
router.post("/", email.createEmailTemplate);



router.get("/:id", email.getOneEmailTemplate)

router.put("/:id", email.getOneEmailTemplateAndUpdate)

router.delete("/:id", email.getOneEmailTemplateAndRemove)




module.exports = router;