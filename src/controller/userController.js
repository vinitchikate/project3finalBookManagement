const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");


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





const createuser = async function(req, res) {
    try {
        let saveData = await userModel.create(req.body);
        res.status(201).send({ status: true, msg: saveData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


//*********************************************USER LOGIN********************************************* */

// handler function for user login

const userLogin = async function (req, res) {
    try {
        const requestBody = req.body;
       

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "please provide input credentials" });
            return
        }

        const userName = requestBody.email;
        const password = requestBody.password;

        // validating userName and password
        if (!isValid(userName)) {
            res.status(400).send({ status: false, message: "email is required" });
            return
        }

        if (!isValidEmail(userName)) {
            res.status(400).send({ status: false, message: "please enter a valid email address" });
            return
        }

        if (!isValid(password)) {
            res.status(400).send({ status: false, message: "password is required" });
            return
        }

        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/.test(password)) {
            res.status(400).send({ status: false, message: "password should be: 8 to 15 characters, at least one letter and one number ", });
            return
        }

        const loginUser = await userModel
        .findOne({email: userName.toLowerCase().trim(),password: password,});

        if (!loginUser) {
             res.status(404).send({ status: false, message: "invalid login credentials" });
            return
        }

        const userID = loginUser._id;
        const payLoad = { userId: userID };
        const secretKey = "bookM49";
    
        // creating JWT
        const token = jwt.sign(payLoad, secretKey, { expiresIn: "600s" });
       
        res.status(200).send({ status: true, message: "login successful", data: token });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

//**********************************EXPORTING HANDLERS FUNCTIONS************************************* */

module.exports.userLogin = userLogin;
module.exports.createuser = createuser;
