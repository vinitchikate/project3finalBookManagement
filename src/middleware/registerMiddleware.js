const userModel = require("../models/userModel");


const isValid = function (value) {
  if (typeof value == "undefined" || value == null) return false;
  if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (object) {
  return Object.keys(object).length > 0;
};
const isValidTitle = function (title) {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidemail = function (email) {
  const regexForemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regexForemail.test(email);
};

const isValidphone = function (phone) {
  const regexForMobile = /^[6-9]\d{9}$/;
  return regexForMobile.test(phone);
};

// ============================================================================================

const registerUserValidation = async function (req, res, next) {
  try {
    const requestBody = req.body;
    const queryParams = req.query;

    // query params must be empty
    if (isValidRequestBody(queryParams)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid request" });
    }

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "user data is required to create a new user",
        });
    }

    const { title, name, phone, email, password, address } = requestBody;

    if (!isValid(title)) {
      return res
        .status(400)
        .send({
          status: false,
          message: `title is required and should be valid format like: Mr/Mrs/Miss`,
        });
    }

    if (!isValidTitle(title)) {
      res.status(400).send({ status: false, message: "Title should be among Mr, Mrs and Miss " })
      return
    }

    if (!isValid(name)) {
      return res
        .status(400)
        .send({
          status: false,
          message: `name is required and should be in valid format`,
        });
    }

    if (!isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "mobile number is required" });
    }

    if (!isValidphone(phone)) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            " please enter a valid 10 digit mobile number without country code and 0",
        });
    }

    const isPhonePresent = await userModel.findOne({ phone });

    if (isPhonePresent) {
      return res
        .status(400)
        .send({
          status: false,
          message: `mobile number: ${phone} already exist`,
        });
    }

    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email address is required" });
    }

    if (!isValidemail(email)) {
      return res
        .status(400)
        .send({
          status: false,
          message: " please enter a valid email address",
        });
    }

    const isEmailPresent = await userModel.findOne({ email });

    if (isEmailPresent) {
      return res
        .status(400)
        .send({ status: false, message: `email: ${email} already exist` });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "password should be: 8 to 15 characters, at least one letter and one number ",
        });
    }

    next();

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};
 
        //  ============================================================================================

const userLoginValidation = async function (req, res, next) {
  try {
    const requestBody = req.body;
    const queryParams = req.query;

    // query params must be empty
    if (isValidRequestBody(queryParams)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid request" });
    }

    if (!isValidRequestBody(requestBody)) {
      return res
        .status(400)
        .send({ status: false, message: "please provide input credentials" });
    }

    const userName = requestBody.email;
    const password = requestBody.password;


    if (!isValid(userName)) {
      return res
        .status(400)
        .send({ status: false, message: "email is required" });
    }

    if (!isValidemail(userName)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter a valid email address" });
    }

    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
      return res
        .status(400)
        .send({
          status: false,
          message:
            "password should be: 8 to 15 characters, at least one letter and one number ",
        });
    }

    // const loginUser = await UserModel.findOne({
    //   email: userName.toLowerCase().trim(),
    //   password: password,
    // });

    // if (!loginUser) {
    //   return res
    //     .status(404)
    //     .send({ status: false, message: "invalid login credentials" });
    // }

    next();

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports.registerUserValidation = registerUserValidation;
module.exports.userLoginValidation = userLoginValidation;