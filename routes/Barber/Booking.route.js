const express = require("express");
const {verifyjwt} = require("../../middleware/auth.middleware");
const { getAllSlotsInShop } = require("../../controller/barber/slots.controller");

const router = express.Router();

router.get("/slots" , verifyjwt , getAllSlotsInShop);
module.exports = router; 