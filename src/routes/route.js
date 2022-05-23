const express = require('express');
const router = express.Router();

const valid = require('../middleware/valid');
const auth = require('../middleware/auth');
const userController = require("../Controller/userController");
const booksController = require("../controller/booksController");
const reviewController = require('../controller/reviewController');


// User APIs
router.post("/register", valid.validRegister, userController.createuser);
router.post("/login", valid.validLogin, userController.userLogin);

// Books API
router.post("/books", auth.authentication, valid.validBook, booksController.createBook);
router.get("/books", auth.authentication, booksController.booksList);
router.get("/books/:bookId", auth.authentication, booksController.getbookId);
router.put("/books/:bookId", auth.authentication, auth.authorization, booksController.updatebook);
router.delete("/books/:bookId", auth.authentication, booksController.deleteBooks);

// Review APIs
router.post("/books/:bookId/review", valid.validreview, reviewController.createreview);
router.put("/books/:bookId/review/:reviewId", valid.updateReview, reviewController.updateReview);
router.delete("/books/:bookId/review/:reviewId", valid.deleteReview, reviewController.dreview);



const aws = require("aws-sdk");
aws.config.update({
    accessKeyId: "AKIAY3L35MCRUJ6WPO6J",
    secretAccessKey: "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",
    region: "ap-south-1"
});
let uploadFile = async (file) => {
    return new Promise(function (resolve, reject) {
        let s3 = new aws.S3({ apiVersion: '2006-03-01' });
        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket",
            Key: "abc/" + file.originalname,
            Body: file.buffer
        }
        s3.upload(uploadParams, function (err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log(data)
            console.log("file uploaded succesfully")
            return resolve(data.Location)
        })
    })
}
router.post("/write-file-aws", async function (req, res) {
    try {
        let files = req.files
        if (files && files.length > 0) {
            let uploadedFileURL = await uploadFile(files[0])
            res.status(201).send({ msg: "file uploaded succesfully", data: uploadedFileURL })
        }
        else {
            res.status(400).send({ msg: "No file found" })
        }
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
});



module.exports = router;