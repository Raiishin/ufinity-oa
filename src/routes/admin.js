import express from "express";
import AdminController from "./src/controllers/admin.js";

const router = express.Router();

router.post("/register", AdminController.registerNewStudents);

router.get("/commonstudents", AdminController.retrieveCommonStudents);

router.post("/suspend", AdminController.suspendStudent);

router.post("/retrievefornotifications", AdminController.canReceiveTeacherNotification);

export default router;
