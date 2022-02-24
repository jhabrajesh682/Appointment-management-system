const router = require("express").Router();
const UserDetail = require("../controllers/userDetail.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const userDetail = new UserDetail();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */

router.post("/", userDetail.findUserDetails);
router.post("/getApplicantData", userDetail.getApplicantData);
router.post("/withoutOtpt", userDetail.findUserDetailsWithoutOtpt);


module.exports = router;
