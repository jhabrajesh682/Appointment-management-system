const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
var cors = require("cors");
const corsOption = require("../middlewares/corsoptions");

const error = require("../middlewares/error.middleware");
require("express-async-errors");
const _app_folder = "dashboard";
// tryinng out

module.exports = function (server) {
  /**
   * Middlewares
   */
  // server.use(require("../middlewares/path.middleware"));
  // console.log(corsOption);

  server.use(morgan("tiny"));
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb", extended: true }));
  server.use(helmet());
  // server.use((req,res,next)=>{
  //     console.log(req.headers);
  //     next()
  // })
  // server.use(cors(corsOption))
  server.use(cors());

  /**
   * Server Routes here
   */

  server.use("/api/v1/appointment", require("../routes/appointment.routes"));
  server.use("/api/v1/slotTemplate", require("../routes/slotTemplate.routes"));
  server.use(
    "/api/v1/actionRequired",
    require("../routes/actionRequired.routes")
  );
  server.use("/api/v1/holiday", require("../routes/holiday.routes"));
  server.use(
    "/api/v1/reasonActionMapping",
    require("../routes/reasonActionMapping.routes")
  );
  server.use(
    "/api/v1/reasonRequired",
    require("../routes/reasonRequired.routes")
  );
  server.use("/api/v1/slot", require("../routes/slot.routes"));
  server.use("/api/v1/slotGroup", require("../routes/slotGroup.routes"));
  server.use(
    "/api/v1/appointmentAudit",
    require("../routes/appointmentAudit.routes")
  );
  server.use("/api/v1/slotAudit", require("../routes/slotAudit.routes"));
  server.use("/api/v1/captcha", require("../routes/captcha.routes"));
  server.use("/api/v1/userDetail", require("../routes/userDetail.routes"));
  server.use("/api/v1/event", require("../routes/events.routes"));
  server.use("/api/v1/email", require("../routes/email.routes"));
  server.use("/api/v1/sms", require("../routes/sms.routes"));
  server.use("/api/v1/bulkcancellationScreen", require("../routes/fetchSlotGoup.routes"));
  server.use("/api/v1/noReferralError", require("../routes/noReferralError.routes"));

  server.use("/api/v1/medicalCenter", require("../routes/medicalCenter.routes"));
  server.use("/api/v1/city", require("../routes/city.routes"));
  server.use("/api/v1/country", require("../routes/country.routes"));
  server.use("/api/v1/business", require("../routes/business.routes"));

  server.use("/api/v1/labels", require("../routes/labels.routes"));
  // server.user("/api/v1/reports", require("../routes/reports.routes"))

  // ---- SERVE STATIC FILES ---- //
  server.get("*.*", express.static(_app_folder, { maxAge: "1y" }));

  // ---- SERVE APLICATION PATHS ---- //
  server.all("*", function (req, res) {
    res.status(200).sendFile(`/`, { root: _app_folder });
  });

  // server.get("/", (req, res) => res.send("Hello World!"));

  /**
   * error handling middleware
   */
  server.use(error);
};
