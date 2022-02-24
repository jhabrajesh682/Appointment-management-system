const router = require("express").Router();
const Country = require("../controllers/country.controller");

// middleware


const country = new Country();

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/ @method - GET
 */

router.get("/", country.getAllCountries);

/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */

router.post("/", country.createCountry);


router.put("/:id", country.getOneCountryAndUpdate)

router.delete("/:id", country.getOneCountryAndRemove)




module.exports = router;
