 const reviewModel = require('../Model/reviewModel')

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
