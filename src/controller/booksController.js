const bookModel = require('../models/booksModel');
const reviewModel = require('../models/reviewModel');
///////////////////////////vinit///////////////////////////////////////////////////////////////////////
const userModel = require("../models/userModel");
const validator = require("../middleware/validator");

// -----------CreateBooks-----------------------------------------------------------------------------------
const createBook = async function (req, res) {
    try {
        const book = req.body
        if (!validator.isValidDetails(book)) {
            res.status(400).send({ status: false, msg: "Please provide the Book details" })   //Validate the value that is provided by the Client.
        }
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = book
        if (req.userId != req.body.userId) {
            return res.status(401).send({ status: false, message: "Unauthorized access." })   //validating that the userId from body is similar to the token
        }

        if (!validator.isValidValue(title)) {
            return res.status(400).send({ status: false, msg: "Please provide the Title" })   //Title is Mandory 
        }

        const isDuplicateTitle = await bookModel.findOne({ title: title })
        if (isDuplicateTitle) {
            return res.status(400).send({ status: true, msg: "Title is already exists." })   //Title is Unique 
        }

        if (!validator.isValidValue(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please provide the excerpt" })   //Excerpt is Mandory 
        }

        const isValidUserId = await userModel.findById(userId)
        if (!isValidUserId) {
            return res.status(404).send({ status: true, msg: "User not found." })   //find User in userModel
        }

        if (!validator.isValidValue(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please provide the ISBN" })   //ISBN is mandory 
        }

        const isDuplicateISBN = await bookModel.findOne({ ISBN: ISBN })   //ISBN is unique
        if (isDuplicateISBN) {
            return res.status(400).send({ status: true, msg: "ISBN is already exists." })   //ISBN is unique 
        }

        if (!validator.isValidValue(category)) {
            return res.status(400).send({ status: false, msg: "Please provide the Category" })   //Category is mandory 
        }

        if (!validator.isValidValue(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please provide the subCategory" })   //subcategory is mandory 
        }

        if (!validator.isValidValue(releasedAt)) {
            return res.status(400).send({ status: false, msg: "Please provide the release date of book." })   //release date is mandory 
        }

        if (!(/^\d{4}-\d{2}-\d{2}$/.test(releasedAt))) {   //regex for checking the correct format of release date 
            return res.status(400).send({ status: false, msg: `${releasedAt} is an invalid date, formate should be like this YYYY-MM-DD` })
        }

        const saved = await bookModel.create(book)  //creating the Book details
        res.status(201).send({ status: true, msg: "Book is created successfully.", data: saved })

    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}


module.exports.createBook = createBook;












/////////////////////////////////////////////////////////////////////////////////////////////////////
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


/////////////////////////////////////////////////////////////////////////////////////////////////////
const booksModel = require('../models/booksModel')

const updatebook = async function(req, res){
    let bookId = req.params.blogId
     let body = req.body 
     let result = await booksModel.findByIdAndUpdate({_id:bookId}, {$set:{$or:[{title:body.title},{excert:body.excert},{releasedate:body.releasedate},{ISBN:DataTransfer.ISBN}, {new:true}]}})
     res.send(result)
    }


    module.exports.updatebook = updatebook

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
