const express = require("express");
const AdminController = require("../controllers/admin.js");

const router = express.Router();

router.post("/register", AdminController.registerNewStudents);

router.get("/commonstudents", AdminController.retrieveCommonStudents);

router.post("/suspend", AdminController.suspendStudent);

router.post("/retrievefornotifications", AdminController.canReceiveTeacherNotification);

module.exports = router;
