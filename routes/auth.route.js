const express = require("express");
const {login,signup, logout, getProfile} = require("../controller/auth.controller");
const { verifyjwt } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/login" ,login );
router.post("/signup" , signup);
router.post("/logout", logout);
router.get("/profile" , verifyjwt , getProfile)

module.exports = router; 