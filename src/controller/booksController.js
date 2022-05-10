const bookModel = require('../models/booksModel');
const reviewModel = require('../models/reviewModel');

const getbookId = async function (req, res) {
    let bookId = req.params.bookId;
    if (bookId.length < 24 || bookId.length > 24) {
        return res.status(400).send({ status: false, msg: "Plz Enter Valid Book Id" });
    }

    let bData = await bookModel.findById(bookId);
    if (!bData) {
        return res.status(404).send({ status: false, message: "Data Not Found" });
    }

    Object.assign(bData._doc, { reviewsData: [] });
    res.status(200).send({ status: true, message: "Books list", data: bData });
};
module.exports = { getbookId };