const router = require("express").Router();
const ReasonRequired = require("../controllers/reasonRequired.controller")

// middleware
const auth=require('../middlewares/auth')//[auth]
const admin=require('../middlewares/admin')//[auth,admin],

const reasonRequired = new ReasonRequired();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", reasonRequired.getAllReason);
router.post("/",reasonRequired.createReason);



router.get("/:id",reasonRequired.getOneReason)

router.put("/:id",reasonRequired.getOneReasonAndUpdate)

router.delete("/:id",reasonRequired.getOneReasonAndRemove)




module.exports = router;