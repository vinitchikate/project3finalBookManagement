const express = require('express');
const router = express.Router();
const userController = require("../Controller/userController");
const middleware = require('../middleware/loginMiddleware');
const booksController = require("../controller/booksController");
const { validateIntern, internValidationResult, validateInternDB, } = require("../middleware/registerMiddleware");


router.post("/user", validateIntern, internValidationResult, validateInternDB, userController.createuser);
router.post("/login", middleware.validLogin, userController.userLogin);
router.put("/put", booksController.updatebook)
router.get("/books/:bookId",booksController.getbookId);
module.exports = router;
