const userModel = require("../Models/userModel");
const BookModel = require("../Models/bookModel");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        console.log(token)
        if (!token) return res.status(400).send({ status: false, message: "Token is required" });
        let decodedToken = jwt.verify(token, "project4");
        console.log(decodedToken)
        if (!decodedToken) return res.status(404).send({ status: false, message: "cannot verify token" })
        const date = new Date();
        console.log(`Token checked at:- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
        req.userId = decodedToken.userId;

        next()
    }
    catch (error) { return res.status(500).send({ status: false, error: error.message }) }
}

const authorization = async (req, res, next) => {

   try{
    let userId = req.userId;
    let data = req.body;
    if (userId != data.userId) return res.status(403).send({ status: false, message: "Unauthorized" });
    next()
}
catch (error) { return res.status(500).send({ status: false, error: error.message }) }
}

module.exports = { authentication , authorization}