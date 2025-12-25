const express = require("express");
const { getAllShops } = require("../../controller/customer/shops.controller");
const router  = express.Router();

router.get("/all-shops" ,getAllShops )

module.exports = router; 