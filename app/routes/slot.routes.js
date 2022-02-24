const router = require("express").Router();
const Slot = require("../controllers/slot.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const slot = new Slot();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", slot.getAllSlot);
router.post("/", slot.createSlot);

router.post("/getSlotByUserDetail", slot.getSlotsByUserDetails);

router.post("/getSlotsBySlotGroup", slot.getSlotsBySlotGroup);
router.post("/getNonZeroSlotsBySlotGroup", slot.getSlotsBySlotGroupNonGroup);

router.post("/bulkReopenSlots", slot.bulkReopenSlots);

router.get("/:id", slot.getOneSlot);

router.put("/:id", slot.getOneSlotAndUpdate);

router.delete("/:id", slot.getOneSlotAndRemove);

module.exports = router;
