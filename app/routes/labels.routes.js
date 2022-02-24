const router = require("express").Router();
const Label = require("../controllers/label.controller")

// middleware
const auth = require('../middlewares/auth')//[auth]
const admin = require('../middlewares/admin')//[auth,admin],

const labels = new Label();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", labels.getAllLabel);
router.post("/", labels.createLabel);



router.get("/:id", labels.getOneLabel)

router.put("/:id", labels.getOneLabelAndUpdate)

router.delete("/:id", labels.getOneLabelAndRemove)




module.exports = router;