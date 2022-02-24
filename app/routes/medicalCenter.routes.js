const router = require("express").Router();
const MedicalCenter = require("../controllers/medicalCenter.controller");

// middleware


const medicalCenter = new MedicalCenter();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", medicalCenter.getAllMedicalCenter);


router.post("/", medicalCenter.createMedicalCenter);


router.put("/:id", medicalCenter.getOneMedicalCenterAndUpdate);

router.delete(
  "/:id",
  medicalCenter.getOneMedicalCenterAndRemove
);

module.exports = router;
