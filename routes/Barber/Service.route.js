const express = require("express");
const {verifyjwt} = require("../../middleware/auth.middleware");
const {addService,updateService ,deleteService, getMyServices} = require("../../controller/barber/services.controller");
const router = express.Router();

router.post("/add-service" , verifyjwt ,addService); 
router.put("/:serviceId", verifyjwt, updateService);
router.delete("/:serviceId", verifyjwt, deleteService);
router.get("/my-services" , verifyjwt , getMyServices);


module.exports = router; 