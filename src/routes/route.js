const express = require('express');
const router = express.Router();

const valid = require('../middleware/valid');
const auth = require('../middleware/auth');
const userController = require("../Controller/userController");
const booksController = require("../controller/booksController");
const { validateIntern, internValidationResult, validateInternDB } = require("../middleware/registerMiddleware");


// User APIs
router.post("/register", validateIntern, internValidationResult, validateInternDB, userController.createuser);
router.post("/login", valid.validLogin, userController.userLogin);

// Books API
router.post("/books", valid.validBook, booksController.createBook);
router.get("/books", booksController.booksList);
router.get("/books/:bookId", booksController.getbookId);
// router.put("/books/:bookId", auth.authentication, booksController.updatebook);
router.delete("/books/:bookId",booksController.deleteBooks);

// Review APIs
// router.post("/books/:bookId/review");
// router.put("/books/:bookId/review/:reviewId");
// router.delete("/books/:bookId/review/:reviewId");


module.exports = router;