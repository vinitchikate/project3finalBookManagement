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

const authentication = async function (req, res, next) {
    try {
      let token = req.headers["x-Api-key"];
      if (!token) token = req.headers["x-api-key"];
      if (!token)
        return res.status(400).send({
          status: false,
          msg: "Token required! Please login to generate token",
        });
  
      let decodedToken = jwt.verify(token, "bookM49");
      if (!decodedToken)
        return res.status(401).send({ status: false, msg: "token is invalid" });
        req["userId"] = decodedToken.userId
      next();
    } catch (err) {
      res.status(500).send({ msg: "Internal Server Error", error: err.message });
    }
  };

module.exports = {authentication};

module.exports = { validLogin };
