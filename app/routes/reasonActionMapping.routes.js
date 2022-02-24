const router = require("express").Router();
const reasonActionMapping = require("../controllers/reasonActionMapping.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const reasonAction = new reasonActionMapping();

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */

router.get("/", reasonAction.getAllReasonAndAction);

router.post("/", reasonAction.createReasonActionMapping);

// router.get("/:id", reasonActionMapping.getOneReasonAndAction);

// router.put("/:id", reasonActionMapping.getOneReasonAndActionAndUpdate);

module.exports = router;
