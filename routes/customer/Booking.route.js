const express = require("express");
const { getSlotsByServiceAndDate ,createBooking} = require("../../controller/customer/Booking.Controller");
const { verifyjwt } = require("../../middleware/auth.middleware");
const { getTodayAppointments } = require("../../controller/customer/Appointments.controller");
const router = express.Router();

router.get("/getslotsbyservice" , getSlotsByServiceAndDate);
router.post("/create" , verifyjwt , createBooking);
router.get("/today", verifyjwt, getTodayAppointments);


module.exports = router; 