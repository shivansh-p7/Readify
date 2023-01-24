const userModel = require("../Models/userModel");
const BookModel = require("../Models/bookModel");
const jwt = require("jsonwebtoken")
const { isValidPassword, isValidEmail, isValidName, isValidPhone } = require('../Validators/validatte');


const createUser = async (req, res) => {
    try {
        let userData = req.body
        if (Object.keys(userData).length == 0) return res.status(400).send({ status: false, message: "please enter some data in order to create..." })
        let { title, name, phone, email, password, address } = userData
        
        if (!title) return res.status(400).send({ status: false, message: "Title is required" })
        const validateTitle = ["Mr", "Mrs", "Miss"]
        if (!validateTitle.includes(title)) return res.status(400).send({ status: false, message: `Title can only contain ${validateTitle}` })

        if(name!=undefined &&(typeof(name)!="string")){
            return res.status(400).send({ status: false, message: "plese enter valid name" })
        }
        if (!name || name.trim()=="")  return res.status(400).send({ status: false, message: "name is required" })
       
        if (!isValidName(name.trim())) return res.status(400).send({ status: false, message: "Please enter valid name" })

        if(phone!=undefined &&(typeof(phone)!="string")){
            return res.status(400).send({ status: false, message: "plese enter valid name" })
        }

        if (!phone ||(typeof(phone)=="string" && phone.trim()==""))  return res.status(400).send({ status: false, message: "Please enter phone number " })
        if (!isValidPhone(phone.trim())) return res.status(400).send({ status: false, message: "Please enter valid phone number" })
        let isPhoneExist = await userModel.findOne({ phone: phone })
        if (isPhoneExist) return res.status(400).send({ status: false, message: "phone number already exist " })

        if (!email || (typeof(email)=="string" && email.trim()=="")) return res.status(400).send({ status: false, message: "Please provide email" })
        if (!isValidEmail(email.trim())) return res.status(400).send({ status: false, message: "Please provide valid email" })
        let isEmailExist = await userModel.findOne({ email: email })
        if (isEmailExist) return res.status(400).send({ status: false, message: "email already exist " })

        if (!password ||(typeof(password)=="string" && password.trim()=="")) return res.status(400).send({ status: false, message: "please enter password" })
        if (!isValidPassword(password.trim())) return res.status(400).send({ status: false, message: "Password should contain Uppercase,Lowercase,Numbers,Special Characters,Minimum length should be 8 and maximun should be 15" })
if(address){ 
    
    let { street, city, pincode } = address
        if (typeof (street) != "string" && street.trim()=="" ) return res.status(400).send({ status: false, message: "please enter valid street name" })
        if (typeof (city) != "string" && city.trim()=="")  return res.status(400).send({ status: false, message: "please enter valid city" })
        if (typeof (pincode) != "string" && pincode.trim()=="") return res.status(400).send({ status: false, message: "please enter valid pincode" })
    }

        let userDetails = await userModel.create(userData)
        res.status(201).send({ status: true, message: "success", data: userDetails })
    }

    catch (error) { res.status(500).send({ status: false, error: error.message }) }
}


const userLogin = async (req, res) => {
    try {
        let userData = req.body;
        if (Object.keys(userData).length == 0) return res.status(400).send({ status: false, message: "please enter some data..." })
        if (Object.keys(userData).length > 2) return res.status(400).send({ status: false, message: "enter only Email and Password" })
        let { email, password } = userData;

        if (!email || email.trim() == "") return res.status(400).send({ status: false, message: "please enter email" })

        if (!password || password.trim() == "") return res.status(400).send({ status: false, message: "please enter password" })
        
        let isUserExist = await userModel.findOne({email:email, password: password })
        if (!isUserExist) return res.status(400).send({ status: false, message: "please enter valid credentials" })

        let token = jwt.sign({ userId: isUserExist._id , exp:(Math.floor(Date.now() / 1000)) + 84600}, "project4");
        console.log("date",Date.now())
        const date = new Date();
        console.log(`Token Generated at:- ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
 
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: token })
    }
    catch (error) { res.status(500).send({ status: false, error: error.message }) }
}

module.exports = { createUser, userLogin }