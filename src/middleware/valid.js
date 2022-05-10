const userModel = require("../models/userModel");
const bookModel = require('../models/booksModel');

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};
const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
};
const isValidEmail = function (email) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForEmail.test(email);
};
const isValidValue = function (value) {      //if the value is undefined or null || string that length is 0 it will return false.
    if (typeof value === 'undefined' || value === null) return false        //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false    //it checks whether the string contain only space or not 
    return true;
};
const isValidDetails = function (requestBody) {
    return Object.keys(requestBody).length > 0;       // it checks, is there any key is available or not in request body
};



const validLogin = async function (req, res, next) {
    try {
        const requestBody = req.body;
        const userName = requestBody.email;
        const password = requestBody.password;

        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide input credentials" });
        }

        // validating userName and password
        if (!isValid(userName)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }

        if (!isValidEmail(userName)) {
            return res.status(400).send({ status: false, message: "please enter a valid email address" });
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }

        // if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
        //     return res.status(400).send({ status: false, message: "password should be: 8 to 15 characters, at least one letter and one number ", });
        // }
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
};



module.exports = { validLogin, validBook };