const express = require("express");
const {verifyjwt} = require("../../middleware/auth.middleware");
const { getAllSlotsInShop } = require("../../controller/barber/slots.controller");
const { getTodayBookingsByService , markBookingDone} = require("../../controller/barber/Booking.controller");

const router = express.Router();

router.get("/slots" , verifyjwt , getAllSlotsInShop);
router.get("/all-booking" , verifyjwt , getTodayBookingsByService);
router.get("/today-bookings/:serviceId" , verifyjwt , getTodayBookingsByService );
router.post("/done/:BookingId" , verifyjwt , markBookingDone);

module.exports = router; 