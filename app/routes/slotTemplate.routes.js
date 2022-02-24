const router = require("express").Router();
const SlotTemplate = require("../controllers/slotTemplate.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const slotTemplate = new SlotTemplate();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", slotTemplate.getAllSlotTemplate);
router.post("/", slotTemplate.createSlotTemplate);

router.get("/getAllReasonAndAction", slotTemplate.getAllReasonAndAction);
router.post("/publishTemplate", slotTemplate.publishSlotTemplate);
router.put("/copyPreviousDay/:id", slotTemplate.copyPreviousDay);
router.put("/copyPreviousWeek/:id", slotTemplate.copyPreviousWeek);


router.get("/:id", slotTemplate.getOneSlotTemplate);

router.put("/:id", slotTemplate.getOneSlotTemplateAndUpdate);

router.delete("/:id", slotTemplate.getOneSlotTemplateAndRemove);

router.get("/deleteslotTemplate/:id", slotTemplate.deleteAllSlotTemplateData)


// router.get("/dum", slotTemplate.creatfun);


module.exports = router;
