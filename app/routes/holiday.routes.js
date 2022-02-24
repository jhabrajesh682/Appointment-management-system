const router = require("express").Router();
const Holiday = require("../controllers/holiday.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const holiday = new Holiday();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/city/:cityId", holiday.getHolidayByMedicalCenter)
router.get("/", holiday.getAllHoliday);
router.post("/", holiday.createHoliday);
router.get("/:id", holiday.getOneHoliday);


router.put("/:id", holiday.getOneHolidayAndUpdate);

router.delete("/:id", holiday.getOneHolidayAndRemove);

module.exports = router;
