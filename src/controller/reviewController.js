const reviewModel = require('../models/reviewModel');
const bookModel = require('../models/booksModel');

const createreview = async function (req, res) {
    try {
        const review = req.body;
        let requestedUserId = req.params.bookId;
        let bodyUser = review.bookId;
        if (requestedUserId !== bodyUser) {
            return res.status(401).send({ status: false, msg: "review is not present" });
        }

        const saved = await reviewModel.create(review);
        res.status(201).send({ status: true, msg: "review is created successfully.", data: saved });
    }
    catch (err) {
        res.status(500).send({ msg: err.message });
    }
};


const dreview = async function (req, res) {
    try {
        let reviewId = req.params.reviewId;
        let bookId = req.params.bookId;

        let uReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true });

        let findb = await bookModel.findById(bookId);
        let decrease = (findb.reviews) - 1;
        let updateCount = await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: decrease });
        
        res.status(200).send({ status: true, msg: "Review Deleted & Review Count Decrease By 1" });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


module.exports = { createreview, dreview };