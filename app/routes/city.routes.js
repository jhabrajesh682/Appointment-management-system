const router = require("express").Router();
const City = require("../controllers/city.controller");

// middleware


const city = new City();

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/ @method - GET
 */

router.get("/", city.getAllCities);

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */

router.post("/", city.createCity);


router.put("/:id", city.getOneCityAndUpdate)

router.delete("/:id", city.getOneCityAndRemove)




module.exports = router;
