const express = require('express');
const router = express.Router();
const userController = require("../Controller/userController");


const { validateIntern, internValidationResult,  validateInternDB,
} = require("../middleware/registerMiddleware");


router.post("/user", validateIntern, internValidationResult,  validateInternDB, userController.createuser);
router.post("/login", userController.userLogin);
module.exports = router;
