const userModel = require('../models/userModel');


const createuser = async function(req, res) {
    try {
        let saveData = await userModel.create(req.body);
        res.status(201).send({ status: true, msg: saveData });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports.createuser = createuser;
