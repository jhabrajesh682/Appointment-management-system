const router = require("express").Router();
const Appointment = require("../controllers/appointment.controller");

// middleware
const auth = require("../middlewares/auth"); //[auth]
const admin = require("../middlewares/admin"); //[auth,admin],

const appointment = new Appointment();
/**
 * @type Express.Router
 *
 * @api - /api/v1/users/create @method - POST
 */
router.get("/", appointment.getAllAppointment);
router.post("/", [auth], appointment.createAppointment);

router.get("/:id", [auth], appointment.getOneAppointment);
// router.put("/:id",[auth],appointment.getOneAppointmentAndUpdate)

router.get("/cancelAppointment/:id", [auth], appointment.getOneAppointmentAndCancel);

router.post("/otpVerification", [auth], appointment.otpVerification);
router.put(
  "/rescheduleAppointment/:id", [auth],
  appointment.getOneAppointmentAndReschedule
);

router.get(
  "/completeAppointment/:id", [auth],
  appointment.getOneAppointmentAndComplete
);
router.get("/absentAppointment/:id", [auth], appointment.getOneAppointmentAndAbsent);
router.post(
  "/BulkcancelAppointment", [auth],
  appointment.bulkCancellationOfAppointments
);

router.post("/history", [auth], appointment.appointmentHistory);

router.delete("/:id", appointment.getOneAppointmentAndRemove);
router.post("/getUpcomingAppointments", appointment.getUpcomingAppointments)

router.post("/getUpcomingAppointmentChartData", appointment.getUpcomingAppointmentChartData)
router.post("/getUpcomingAppointmentBarChartData", appointment.getUpcomingAppointmentBarChartData)
// router.post("/getUpcomingAppointmentPdfData", appointment.getUpcomingAppointmentPdfData)

module.exports = router;
