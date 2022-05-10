const { check, validationResult } = require("express-validator");
const userModel = require("../models/userModel");


exports.validatebooks = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("title is a rquired field")
    .not()
    .isNumeric()
    .withMessage("invalid title : numbers not allowed")
    .isLength({ min: 1, max: 4 })
    .withMessage("title must be within 1 to 4 characters"),
  check("excerpt")
    .trim()
    .not()
    .isEmpty()
    .withMessage("excerpt is a rquired field")
    .not()
    .isNumeric()
    .withMessage("invalid excerpt : numbers not allowed")
    .isLength({ min: 4, max: 20 })
    .withMessage("excerpt must be within 4 to 20 characters"),
  check("ISBN")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email is a required field")
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .withMessage("invalid ISBN"),
   check("category")
    .trim()
    .not()
    .isEmpty()
    .withMessage("category is a rquired field")
    .not()
    .isNumeric()
    .withMessage("invalid category : numbers not allowed")
    .isLength({ min: 4, max: 20 })
    .withMessage("category must be within 4 to 20 characters"),
   check("subcategory")
    .trim()
    .not()
    .isEmpty()
    .withMessage("subcategory is a rquired field")
    .not()
    .isNumeric()
    .withMessage("invalid subcategory : numbers not allowed")
    .isLength({ min: 4, max: 20 })
    .withMessage("subcategory must be within 4 to 20 characters"),
];

exports.bookValidationResult = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.status(400).send({ status: false, msg: error });
};

exports.validatebookDb = async (req, res, next) => {
  let data = req.body;

  let ISBNCheck = await userModel.findOne({ ISBN: data.ISBN });
  if (ISBNCheck) {
    return res.status(400).send({ status: false, msg: "ISBN Number Already Exists" });
  }

  let userIDCheck = await userModel.findOne({ userID: data.userID });
  if (userIDCheck) {
    return res.status(400).send({ status: false, msg: "userID Already Exists" });
  }

  next()
};
