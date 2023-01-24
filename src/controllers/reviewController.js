
const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const mongoose = require('mongoose')
const moment = require("moment")
const {isValidName,isValidReview}=require("../Validators/validatte")


const createReview= async (req,res)=>{
try{
   let reviewData=req.body
   let bookId=req.params.bookId
   if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "invalid bookId" })
let {reviewedBy,rating,review,reviewedAt}=reviewData

if(Object.keys(reviewData).length==0) return res.status(400).send({ status: false, message: "please enter the review details" })
// if(!reviewedBy) return res.status(400).send({ status: false, message: "please enter the reviewer name" })

if(reviewedBy){
 reviewData.reviewedBy=reviewedBy.trim()
if(!isValidName(reviewedBy)) return res.status(400).send({ status: false, message: "please enter the valid reviewer name" })
}

if(!rating) res.status(400).send({ status: false, message: "please give rating" })
if (typeof rating !== 'number' || !/^[1-5]{1}$/.test(rating)) {
    return res.status(400).send({ status: false, message: "Invalid rating or rating is not mentioned."})
}

if(!review)  return res.status(400).send({ status: false, message: "please provide review"})
review=review.trim()
if(!isValidReview(review)) return  res.status(400).send({ status: false, message: "review should contain only letters and numbers"})


let isBookExist= await bookModel.findOneAndUpdate({_id:bookId,isDeleted:false},{$inc:{reviews:1}});
if(!isBookExist) return res.status(404).send({status:false,message:"book not found"})

reviewedAt=moment().format("YYYY-MM-DD")
reviewData.reviewedAt=reviewedAt
reviewData.bookId=bookId
let createdReview= await reviewModel.create(reviewData);



return res.status(201).send({status:true,data:createdReview})

}
catch(error){
return res.status(500).send({status:false,error:error.message})
}

}
module.exports={createReview}

