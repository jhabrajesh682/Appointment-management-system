const router = require("express").Router();
const BulcancellationScreen = require("../controllers/bulcancellationScreen.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const bulcancellationScreen = new BulcancellationScreen();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.post("/", bulcancellationScreen.fetchSlotGroup);
router.get("/:id", bulcancellationScreen.fetchSlots);


module.exports = router;
