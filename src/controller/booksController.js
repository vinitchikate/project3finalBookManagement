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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const BookModel = require("../models/booksModel");
const UserModel = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const moment = require("moment");
const ReviewModel = require("../models/reviewModel");


//***************************************VALIDATION FUNCTIONS************************************************** */

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
};

const isValidIdType = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidSubcategory = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
    if (typeof value == "object" && Array.isArray(value) == true) return true;
};




const booksList = async function (req, res) {
    try {
        const requestBody = req.body;
        const queryParams = req.query;
        const filterConditions = { isDeleted: false, deletedAt: null };

        if (isValidRequestBody(requestBody)) {
           res.status(400).send({ status: false, message: "content from body not required" });
           return 
        }

        if (isValidRequestBody(queryParams)) {

            const { userId, category, subcategory } = queryParams;

            if (queryParams.hasOwnProperty("userId")) {
                if (isValid(userId) && isValidIdType(userId)) {
                    const userById = await UserModel.findById(userId);
                    if (userById) {
                        filterConditions["userId"] = userId.trim();
                    } else {
                         res.status(404).send({ status: false, message: `no user present by Id ${userId}` });
                         return
                    }
                } else {
                     res.status(400).send({ status: false, message: "enter a valid userId" });
                     return
                }
            }

            if (queryParams.hasOwnProperty("category")) {
                if (isValid(category)) {
                    filterConditions["category"] = category.trim();
                } else {
                     res.status(400).send({ status: false, message: `format for category is incorrect` });
                     return
                }
            }

            if (queryParams.hasOwnProperty("subcategory")) {
                if (isValidSubcategory(subcategory)) {

                    filterConditions["subcategory"] = subcategory;

                } else {
                     res.status(400).send({status: false,message: `format for subcategory is incorrect`,});
                     return
                }
            }
            const filteredBookList= await BookModel.find(filterConditions).select({_id: 1,title: 1,excerpt: 1,userId: 1,category: 1, subcategory: 1,releasedAt: 1,reviews: 1,}).sort({ title: 1 });

            if (filteredBookList.length == 0) { 
                res.status(404).send({ status: false, message: "no books entry present" });
                 return
                    }

            res.status(200).send({status: true,message: "filtered books enteries are here",booksCount: filteredBookList.length,bookList: filteredBookList,});         
        } 
        else {
            const bookList = await BookModel.find(filterConditions).select({_id: 1,title: 1,userId: 1,category: 1,subcategory: 1,releasedAt: 1,reviews: 1,}).sort({ title: 1 });

            if (bookList.length == 0) {
                 res.status(404).send({ status: false, message: "no books found" });
                 return
                
            }

            res.status(200).send({status: true,message: "Book list is here",booksCount: bookList.length,bookList: bookList,});
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


module.exports.booksList = booksList;





module.exports = { getbookId };
