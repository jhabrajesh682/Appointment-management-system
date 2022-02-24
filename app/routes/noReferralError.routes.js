const router = require("express").Router();
const NoReferralError = require("../controllers/noReferralError.controller")

// middleware
const auth = require('../middlewares/auth')//[auth]
const admin = require('../middlewares/admin')//[auth,admin],

const noReferralError = new NoReferralError();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", noReferralError.getAllNoReferralError);
router.post("/", noReferralError.createNoReferralError);



router.get("/:id", noReferralError.getOneNoReferralError)

router.put("/:id", noReferralError.getOneNoReferralErrorAndUpdate)

router.delete("/:id", noReferralError.getOneNoReferralErrorAndRemove)




module.exports = router;