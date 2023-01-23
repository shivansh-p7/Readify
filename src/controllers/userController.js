const userModel=require("../Models/userModel");
const BookModel=require("../Models/bookModel");
const {isValidPassword,isValidEmail,isValidName,isValidPhone}=require('../Validators/validatte')


const createUser= async (req,res)=>{
    let userData=req.body
    if(Object.keys(userData).length==0){
        return res.status(400).send({status:false,message:"please enter some data in order to create..."})
    }
    let {title,name,phone,email,password,address}=userData
    if(!title){
        return res.status(400).send({status:false,message:"Title is required"})
    }

    const validateTitle=["Mr","Mrs","Miss"]
    if(!validateTitle.includes(title)){
        return res.status(400).send({status:false,message :`Title can only contain ${validateTitle}`})
    }
    if( !name || name.trim()==""){
        return res.status(400).send({status:false,message:"name is required"})
    }
    
    if(!isValidName(name)){
        return res.status(400).send({status:false,message:"Please enter valid name"})
    }

    if(!phone || phone.trim()==""){
        return res.status(400).send({status:false,message:"Please enter phone number "})
    }
    
    if(!isValidPhone(phone)){
        return res.status(400).send({status:false,message:"Please enter valid phone number"})
    }

    let isPhoneExist=await userModel.findOne({phone:phone})
    if(isPhoneExist){
        return res.status(400).send({status:false,message:"phone number already exist "})
    }

    if(!email ||email.trim()==""){
        return res.status(400).send({status:false,message:"Please provide email"})
    }
  
    if(!isValidEmail(email)){
        return res.status(400).send({status:false,message:"Please provide valid email"})

    }
    let isEmailExist=await userModel.findOne({email:email})
    if(isEmailExist){
        return res.status(400).send({status:false,message:"email already exist "})
    }

    if(!password || password.trim()==""){
        return res.status(400).send({status:false,message:"please enter password"})
    }

    if(!isValidPassword(password)){
        return res.status(400).send({status:false,message:"please enter valid password"})
    }

    
    let {street,city,pincode}=address
    if(typeof(street)!="string"){
        return res.status(400).send({status:false,message:"please enter valid street name"})
    }
    if(typeof(city)!="string"){
        return res.status(400).send({status:false,message:"please enter valid city"})
    }
    if(typeof(pincode)!="string"){
        return res.status(400).send({status:false,message:"please enter valid pincode"})
    }

    let userDetails=await userModel.create(userData)
    res.status(201).send({status:true,message:"success",data:userDetails})
}


const userLogin= async (req,res)=>{

}

module.exports={createUser,userLogin}