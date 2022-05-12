const jwt = require('jsonwebtoken');
const bookModel = require('../models/booksModel');



const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-Api-key"];
        if (!token) token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, msg: "Token required! Please login to generate token" });
        }

        let tokenValidity = jwt.decode(token, "bookM49");
        let tokenTime = (tokenValidity.expiresIn) * 1000;
        let CreatedTime = Date.now()
        if (CreatedTime > tokenTime) {
            return res.status(400).send({ status: false, msg: "token is expired, login again" })
        }

        let decodedToken = jwt.verify(token, "bookM49");
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
        }
        req["userId"] = decodedToken.userId;

        next();
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
};


const authorization = async function (req, res, next) {
    try {
        let requestedUserId = req.userId;
        let paramsBookId = req.params.bookId;
        if (paramsBookId.length < 24 || paramsBookId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid Length Of BookId Params" });
        }
        
        const isBookPresent = await bookModel.findById({ _id: paramsBookId, isDeleted: false, deletedAt: null });
        if (!isBookPresent) {
            return res.status(404).send({ status: false, msg: "Book is not present" });
        }

        let presentedUserId = isBookPresent.userId.toString().replace(/ObjectId\("(.*)"\)/, "$1");
        if (requestedUserId !== presentedUserId) {
            return res.status(401).send({ status: false, msg: "Unauthorized" });
        }

        next();
    } catch (err) {
        res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
};



module.exports = { authentication, authorization };