const router = require("express").Router();
const ActionRequired = require("../controllers/actionRequired.controller")

// middleware
const auth=require('../middlewares/auth')//[auth]
const admin=require('../middlewares/admin')//[auth,admin],

const actionRequired = new ActionRequired();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", actionRequired.getAllAction);
router.post("/",actionRequired.createAction);



router.get("/:id",actionRequired.getOneAction)

router.put("/:id",actionRequired.getOneActionAndUpdate)

router.delete("/:id",actionRequired.getOneActionAndRemove)




module.exports = router;