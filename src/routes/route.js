const express = require('express');
const router = express.Router();

const valid = require('../middleware/valid');
const auth = require('../middleware/auth');
const userController = require("../Controller/userController");
const booksController = require("../controller/booksController");


// User APIs
router.post("/register", valid.validRegister, userController.createuser);
router.post("/login", valid.validLogin, userController.userLogin);

// Books API
router.post("/books", auth.authentication, valid.validBook, booksController.createBook);
router.get("/books", auth.authentication, booksController.booksList);
router.get("/books/:bookId", booksController.getbookId);
router.put("/books/:bookId", auth.authentication, auth.authorization, booksController.updatebook);
router.delete("/books/:bookId", auth.authentication, booksController.deleteBooks);

// Review APIs
// router.post("/books/:bookId/review");
// router.put("/books/:bookId/review/:reviewId");
// router.delete("/books/:bookId/review/:reviewId");


module.exports = router;