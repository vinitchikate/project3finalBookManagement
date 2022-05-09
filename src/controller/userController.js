const userModel = require('../models/userModel');
const jwt = require("jsonwebtoken");


<<<<<<< HEAD
const createuser = async function (req, res) {
=======
const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
};

const isValidRequestBody = function (value) {
    return Object.keys(value).length > 0;
};

const isValidEmail = function (email) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForEmail.test(email);
};





const createuser = async function(req, res) {
>>>>>>> eb246a8e2f3aebac5464da30e6e352d35c6bb803
    try {
        let saveData = await userModel.create(req.body);
        res.status(201).send({ status: true, msg: saveData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


const userLogin = async function (req, res) {
    try {
        const requestBody = req.body;
        const userName = requestBody.email;
        const password = requestBody.password;

        const loginUser = await userModel.findOne({ email: userName.toLowerCase().trim(), password: password, });
        if (!loginUser) {
            return res.status(404).send({ status: false, message: "invalid login credentials" });
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



module.exports = { userLogin, createuser };