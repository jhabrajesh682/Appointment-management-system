const router = require("express").Router();
const SlotAudit = require("../controllers/slotAudit.controller")

// middleware
const auth=require('../middlewares/auth')//[auth]
const admin=require('../middlewares/admin')//[auth,admin],

const slotAudit = new SlotAudit();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", slotAudit.getAllSlotAudit);
router.get("/:id",slotAudit.getOneSlotAudit)





module.exports = router;