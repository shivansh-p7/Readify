const bookModel=require("../Models/bookModel");
const userModel=require("../Models/userModel");
const mongoose = require('mongoose')
const {isValidName,isValidExcerpt} = require('../Validators/validatte');


const createBook= async (req,res)=>{
   try{ let bookData = req.body
    if(Object.keys(bookData).length==0) return res.status(400).send({status:false,message:"Please put book data"})
    
    let {title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt} = bookData

    if(!title || title.trim()=="") return res.status(400).send({status:false,message:"Please enter book title"})
    if(!isValidName(title)) return res.status(400).send({status:false,message:"Please enter valid title"})
    let isTitleExits = await bookModel.findOne({title:title})
    if(isTitleExits) return res.status(400).send({status:false,message:"Title exits"})

    if(!excerpt || excerpt.trim()=="") return res.status(400).send({status:false,message:"Please enter book excerpt"})
    if(!isValidExcerpt(excerpt)) return res.status(400).send({status:false,message:"Please enter valid excerpt"})

    if(!userId || userId.trim()=="") return res.status(400).send({status:false,message:"Please enter book userId"})
    if(!mongoose.isValidObjectId(userId)) return res.status(400).send({status:false,message:"please enter valid userID"})

    if(!ISBN || ISBN.trim()=="") return res.status(400).send({status:false,message:"Please enter book ISBN"})
    let isISBNExits = await bookModel.findOne({ISBN:ISBN})
    if(isISBNExits) return res.status(400).send({status:false,message:"ISBN exits"})

    if(!category || category.trim()=="") return res.status(400).send({status:false,message:"Please enter book category"})
    if(!isValidName(category)) return res.status(400).send({status:false,message:"Please enter valid Category"})


    if(!subcategory || subcategory.trim()=="") return res.status(400).send({status:false,message:"Please enter book subcategory"})
    if(!isValidName(subcategory)) return res.status(400).send({status:false,message:"Please enter valid subcategory"})

    // if(!reviews) return res.status(400).send({status:false,message:"Please enter book reviews"})
    // if(!releasedAt) return res.status(400).send({status:false,message:"Please enter book title"})
    // releasedAt=Date.now()
     
    // console.log(releasedAt)

    let createBook = await bookModel.create(bookData)
    return res.status(201).send({status:true,message:'Success',Data:createBook})
}
catch(err){
    return res.status(500).send({status:false,Error:err.message})
}

}


const getBook= async (req,res)=>{
    


}

module.exports={createBook,getBook}
