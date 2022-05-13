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
        let findreviewId = await reviewModel.findById(reviewId);
        if (!findreviewId) {
            return res.status(404).send({ status: false, msg: "Review Id Not Found, Plz Enter Valid ReviewId" });
        }
        if (findreviewId.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Review Is Already Deleted" });
        }

        let bookId = req.params.bookId;
        let findbookId = await bookModel.findById(bookId);
        if (!findbookId) {
            return res.status(404).send({ status: false, msg: "Book Id Not Found, Plz Enter Valid BookId" });
        }
        
        let uReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true });
        let findb = await bookModel.findById(bookId);
        let decrease = (findb.reviews) - 1;
        console.log(decrease)
        let updateCount = await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: decrease });

        res.status(200).send({ status: true, data: uReview });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}



module.exports = { createreview, dreview };