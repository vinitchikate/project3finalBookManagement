const express = require('express');
const router = express.Router();
const userController = require("../Controller/userController");





router.post("/register/user", userController.createuser);
module.exports = router;