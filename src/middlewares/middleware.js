const userModel = require("../Models/userModel");
const BookModel = require("../Models/bookModel");
const jwt = require("jsonwebtoken")

const authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: true, message: "Token is required" });
        try {
            let decodedToken = jwt.verify(token, "project4");
            let time = Date.now()
            let exp = decodedToken.exp
            console.log(exp)
            next()
        }
        catch (error) { if (!decodedToken) return res.status(400).send({ status: false, message: "token is not valid" }) }
    }
    catch (error) { return res.status(500).send({ status: false, error: error.message }) }
}

module.exports={authentication}