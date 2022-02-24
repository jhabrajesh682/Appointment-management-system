    const router = require("express").Router();
    const AppointmentAudit = require("../controllers/appointmentAudit.controller")

    // middleware
    const auth=require('../middlewares/auth')//[auth]
    const admin=require('../middlewares/admin')//[auth,admin],

    const appointmentAudit = new AppointmentAudit();
    /**
     * @type Express.Router
     *
     * @api - /api/v1/users/create @method - POST
     */
    router.get("/", appointmentAudit.getAllAppointmentAudit);
    router.get("/:id",appointmentAudit.getOneAppointmentAudit)





    module.exports = router;