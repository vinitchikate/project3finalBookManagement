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

//*******************************************UPDATING A REVIEW*********************************************** */



const updateReview = async function (req, res) {
    try {
        const queryParams = req.query
        const requestBody = req.body
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        // query params must be empty
        if (isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "invalid request" })
        }
        // request body must be empty
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "data is required for review update" })
        }

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is required in path params" })
        }

        if (!isValidIdType(bookId)) {
            return res.status(400).send({ status: false, message: `enter a valid bookId` })
        }


        const bookByBookId = await BookModel.findOne({ _id: bookId, isDeleted: false, deletedAt: null }).lean()

        if (!bookByBookId) {
            return res.status(404).send({ status: false, message: ` No Book found by ${bookId}` })
        }

        if (!reviewId) {
            return res.status(400).send({ status: false, message: "reviewId is required in path params" })
        }

        if (!isValidIdType(reviewId)) {
            return res.status(400).send({ status: false, message: `enter a valid reviewId` })
        }

        const reviewByReviewId = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })

        if (!reviewByReviewId) {
            return res.status(404).send({ status: false, message: `No review found by ${reviewId} ` })
        }

        if (reviewByReviewId.bookId != bookId) {
            return res.status(404).send({ status: false, message: "review is not from this book" })
        }

        const { review, reviewedBy, rating } = requestBody

        // creating an empty object for adding all updates as per requestBody
        const update = {}

        // if requestBody has the mentioned property then validating that property and adding it to updates object
        if (requestBody.hasOwnProperty("reviewedBy")) {
            if (!isValid(reviewedBy)) {
                return res.status(400).send({ status: false, message: `enter a valid name like: "JOHN" ` })
            }

            update["reviewedBy"] = reviewedBy.trim()

        }

        if (requestBody.hasOwnProperty("rating")) {
            if (!isValidRating(rating)) {
                return res.status(400).send({ status: false, message: "rate the book from 1 to 5, in Number format" })
            }

            update["rating"] = rating
        }

        if (requestBody.hasOwnProperty("review")) {
            if (typeof (review) === "string" && review.trim().length > 0) {

                update['review'] = review.trim()

            } else {
                return res.status(400).send({ status: false, message: `enter review in valid format like : "awesome book must read" ` })
            }
        }

        const reviewUpdate = await ReviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false }, { $set: update }, { new: true })

        const allReviewsOfThisBook = await ReviewModel.findOne({ bookId: bookId, isDeleted: false })

        // adding a temporary property inside book which consist all reviews of this book 
        bookByBookId["reviewsData"] = allReviewsOfThisBook
        console.log(bookByBookId)
        console.log(allReviewsOfThisBook)

        res.status(200).send({ status: true, message: "review updated successfully", data: bookByBookId })

    } catch (err) {
        res.status(500).send({ error: err.message })
    }
}


module.exports = { createreview, dreview, updateReview };
