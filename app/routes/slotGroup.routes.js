const router = require("express").Router();
const SlotGroup = require("../controllers/slotGroup.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const slotGroup = new SlotGroup();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", slotGroup.getAllSlotGroup);
router.post("/", slotGroup.createSlotGroup);

router.get("/:id", slotGroup.getOneSlotGroup);

router.put("/:id", slotGroup.getOneSlotGroupAndUpdate);

router.delete("/:id", slotGroup.getOneSlotGroupAndRemove);

router.post("/fourWeeks", slotGroup.getSlotGroupsforNextFourWeeks);

router.post("/getSlotsByDateWise", slotGroup.getAllSlotsByDateWise)

module.exports = router;
