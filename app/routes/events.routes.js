const router = require("express").Router();
const Event = require("../controllers/events.controller")

// middleware
const auth = require('../middlewares/auth')//[auth]
const admin = require('../middlewares/admin')//[auth,admin],

const event = new Event();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", event.getAllEvent);
router.get("/byCity/:cityId", event.getAllEventByCity)

router.post("/", event.createEvent);



router.get("/:id", event.getOneEvent)

router.put("/:id", event.getOneEventAndUpdate)

router.delete("/:id", event.getOneEventAndRemove)




module.exports = router;