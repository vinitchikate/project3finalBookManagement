const { check, validationResult } = require("express-validator");
const userModel = require("../models/userModel")



exports.validateIntern = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("title is a rquired field")
    .not()
    .isNumeric()
    .withMessage("invalid title : numbers not allowed")
    .isLength({ min: 1, max: 4 })
    .withMessage("name must be within 4 to 20 characters"),
   check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("name is a rquired field")
    .not()
    .isNumeric()
    .withMessage("invalid name : numbers not allowed")
    .isLength({ min: 4, max: 20 })
    .withMessage("name must be within 4 to 20 characters"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("email is a required field")
    .isEmail()
    .withMessage("invalid email"),
  check("phone")
    .trim()
    .not()
    .isEmpty()
    .withMessage("phone is a required field")
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .withMessage("invalid phone"),
  check("address")
    .trim()
    .not()
    .isEmpty()
    .withMessage("address is a rquired field")
    .not()
    .isNumeric()
    .withMessage("invalid  : numbers not allowed"),
  
];

exports.internValidationResult = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.status(400).send({ status: false, msg: error });
};

exports.validateInternDB = async (req,res,next) =>{
  let data = req.body;
   

  let numberCheck = await userModel.findOne({ phone: data.mobile });

  if (numberCheck)
    return res
      .status(400)
      .send({ status: false, msg: "Mobile Number Already Exists" });

  let emailCheck = await userModel.findOne({ email: data.email });

  if (emailCheck)
    return res
      .status(400)
      .send({ status: false, msg: "EmailId Already Exists" });

  let addressCheck = await userModel.findOne({ address: data.address });

  if (addressCheck)
    return res
      .status(400)
      .send({ status: false, msg: "address Already Exists" });

  next()

}