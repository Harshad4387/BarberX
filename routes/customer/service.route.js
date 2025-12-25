const express = require("express");
const { getServicesByBarberId } = require("../../controller/customer/service.controller");
const router  = express.Router();

router.get("/:barberId" , getServicesByBarberId);

module.exports = router; 