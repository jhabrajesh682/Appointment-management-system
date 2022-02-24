const router = require("express").Router();
const Business = require("../controllers/business.controller");

// middleware


const business = new Business();

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/ @method - GET
 */

// router.get("/",[auth], business.getAllBusiness);

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */

router.get("/", business.getAllBusiness);

router.post("/", business.createBusiness);


router.put("/:id", business.getOneBusinessAndUpdate)

router.delete("/:id", business.getOneBusinessAndRemove)




module.exports = router;
