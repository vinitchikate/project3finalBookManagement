const mongoose = require('mongoose')
const userModel = require("../models/userModel");
const bookModel = require('../models/booksModel');
const reviewModel = require('../models/reviewModel');

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};
const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
};
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
};
const isValidemail = function (email) {
    const regexForemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForemail.test(email);
};
const isValidphone = function (phone) {
    const regexForMobile = /^[6-9]\d{9}$/;
    return regexForMobile.test(phone);
};
const isValidValue = function (value) {      //if the value is undefined or null || string that length is 0 it will return false.
    if (typeof value === 'undefined' || value === null) return false        //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false    //it checks whether the string contain only space or not 
    return true;
};
const isValidDetails = function (requestBody) {
    return Object.keys(requestBody).length > 0;       // it checks, is there any key is available or not in request body
};

const isValidObjectId = function (ObjectId) {

    return mongoose.Types.ObjectId.isValid(ObjectId);
};

const isValidarr = function (value) {
    if (typeof value === 'undefined' || value === null) return false        //it checks whether the value is null or undefined.
    if (typeof value != 'number' && (value < 1 || value > 5)) return false    //it checks whether the string contain only space or not 
    return true;
}



const validRegister = async function (req, res, next) {
    try {
        const queryParams = req.query;
        if (isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "invalid request" });
        }

        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "user data is required to create a new user" });
        }

        const { title, name, phone, email, password, address } = requestBody;
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: `title is required and should be valid format like: Mr/Mrs/Miss` });
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Title should be among Mr, Mrs and Miss" });
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: `name is required and should be in valid format` });
        }

        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "mobile number is required" });
        }
        if (!isValidphone(phone)) {
            return res.status(400).send({ status: false, message: " please enter a valid 10 digit mobile number without country code and 0" });
        }

        const isPhonePresent = await userModel.findOne({ phone });
        if (isPhonePresent) {
            return res.status(400).send({ status: false, message: `mobile number: ${phone} already exist` });
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email address is required" });
        }
        if (!isValidemail(email)) {
            return res.status(400).send({ status: false, message: " please enter a valid email address" });
        }

        const isEmailPresent = await userModel.findOne({ email });
        if (isEmailPresent) {
            return res.status(400).send({ status: false, message: `email: ${email} already exist` });
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: "password should be: 8 to 15 characters, at least one letter and one number " });
        }

        next();
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
};


const validLogin = async function (req, res, next) {
    try {
        const queryParams = req.query;
        if (isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "invalid request" });
        }

        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide input credentials" });
        }

        const userName = requestBody.email;
        if (!isValid(userName)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }
        if (!isValidemail(userName)) {
            return res.status(400).send({ status: false, message: "please enter a valid email address" });
        }

        const password = requestBody.password;
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
            return res.status(400).send({ status: false, message: "password should be: 8 to 15 characters, at least one letter and one number " });
        }

        next();
    }
    catch (err) {
        res.status(500).send({ error: err.message });
    }
};



const validBook = async function (req, res, next) {
    const book = req.body;

    //Validate the value that is provided by the Client.
    if (!isValidDetails(book)) {
        res.status(400).send({ status: false, msg: "Please provide the Book details" })
    }

    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = book

    //validating that the userId from body is similar to the token
    if (req.userId != req.body.userId) {
        return res.status(401).send({ status: false, message: "Unauthorized access." })
    }

    if (!isValidValue(title)) {
        return res.status(400).send({ status: false, msg: "Please provide the Title" })
    }

    const isDuplicateTitle = await bookModel.findOne({ title: title })
    if (isDuplicateTitle) {
        return res.status(400).send({ status: true, msg: "Title is already exists." })
    }
    if (!isValidValue(excerpt)) {
        return res.status(400).send({ status: false, msg: "Please provide the excerpt" })
    }

    const isValidUserId = await userModel.findById(userId)
    if (!isValidUserId) {
        return res.status(404).send({ status: true, msg: "User not found." })
    }
    if (!isValidValue(ISBN)) {
        return res.status(400).send({ status: false, msg: "Please provide the ISBN" })
    }

    if (!(/^(?=(?:\D*\d){13}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN))) {
        return res.status(400).send({ status: false, msg: "Plz Enter Valid ISBN" });
    }

    const isDuplicateISBN = await bookModel.findOne({ ISBN: ISBN })
    if (isDuplicateISBN) {
        return res.status(400).send({ status: true, msg: "ISBN is already exists." })
    }
    if (!isValidValue(category)) {
        return res.status(400).send({ status: false, msg: "Please provide the Category" })
    }
    if (!isValidValue(subcategory)) {
        return res.status(400).send({ status: false, msg: "Please provide the subCategory" })
    }
    if (!isValidValue(releasedAt)) {
        return res.status(400).send({ status: false, msg: "Please provide the release date of book." })
    }

    //regex for checking the correct format of release date
    if (!(/^\d{4}-\d{2}-\d{2}$/.test(releasedAt))) {
        return res.status(400).send({ status: false, msg: `${releasedAt} is an invalid date, formate should be like this YYYY-MM-DD` })
    }
    next();
};


const validreview = async function (req, res, next) {
    try {
        const queryParams = req.query;
        if (isValidRequestBody(queryParams)) {
            return res.status(400).send({ status: false, message: "invalid request" });
        }

        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "content is required to create a new user" });
        }

        const { bookId, reviewedBy, rating, review } = requestBody;

        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "reviewed by is required" });
        }

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "bookId  is invalid" });
        }

        if (!isValid(review)) {
            return res.status(400).send({ status: false, message: "review  is required" });
        }

        if (!isValidarr(rating)) {
            return res.status(400).send({ status: false, message: "review  is required" });
        }

        next()

    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};


const deleteReview = async function (req, res, next) {
    try {
        let reviewId = req.params.reviewId;
        if (reviewId.length < 24 || reviewId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid ReviewId In Params" });
        }

        let findreviewId = await reviewModel.findById(reviewId);
        if (!findreviewId) {
            return res.status(404).send({ status: false, msg: "Review Id Not Found, Plz Enter Valid ReviewId" });
        }
        if (findreviewId.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Review Is Already Deleted" });
        }

        let bookId = req.params.bookId;
        if (bookId.length < 24 || bookId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid ReviewId In Params" });
        }

        let findbookId = await bookModel.findById(bookId);
        if (!findbookId) {
            return res.status(404).send({ status: false, msg: "Book Id Not Found, Plz Enter Valid BookId" });
        }

        next();
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports = { validRegister, validLogin, validBook, validreview, deleteReview };