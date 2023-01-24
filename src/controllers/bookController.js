const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const reviewModel = require("../Models/reviewModel");
const mongoose = require('mongoose')
const moment = require("moment")

const { isValidExcerpt, isValidTitle,isValidISBN } = require('../Validators/validatte');

const createBook = async (req, res) => {
    try {
        let bookData = req.body
        if (Object.keys(bookData).length == 0) return res.status(400).send({ status: false, message: "Please put book data" })

        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookData
    
        if (!title  || (typeof(title)=="string" && title.trim()=="" ) ) return res.status(400).send({ status: false, message: "Please enter book title" })
       //if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "Please enter valid title" })
    
        let isTitleExits = await bookModel.findOne({ title: title.trim() })
        if (isTitleExits) return res.status(400).send({ status: false, message: "Title already exits" })

        if (!excerpt || (typeof(excerpt)=="string" && excerpt.trim()=="" )) return res.status(400).send({ status: false, message: "Please enter book excerpt" })
        if (!isValidExcerpt(excerpt.trim()) ) return res.status(400).send({ status: false, message: "Please enter valid excerpt" })

        if (!userId || userId.trim() == "") return res.status(400).send({ status: false, message: "Please enter book userId" })
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please enter valid userID" })

        if (!ISBN || (typeof(ISBN)=="string" && ISBN.trim()=="" )) return res.status(400).send({ status: false, message: "Please enter book ISBN" })
        if(!isValidISBN(ISBN.trim()) )  return res.status(400).send({ status: false, message: "Please enter valid ISBN"})
        
    
        let isISBNExits = await bookModel.findOne({ ISBN: ISBN.trim() })
        if (isISBNExits) return res.status(400).send({ status: false, message: "ISBN already exits" })

        if (!category || category.trim() == "") return res.status(400).send({ status: false, message: "Please enter book category" })

        if (!subcategory || subcategory.trim() == "") return res.status(400).send({ status: false, message: "Please enter book subcategory" })

        releasedAt = moment().format("YYYY-MM-DD")
        bookData.releasedAt = releasedAt;
       bookData.title=title.trim()
         bookData.excerpt=excerpt.trim()
         bookData.ISBN=ISBN.trim()
        let createBook = await bookModel.create(bookData)
        return res.status(201).send({ status: true, message: 'Success', Data: createBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


const getBooks = async (req, res) => {
    let data = req.query;
    if (Object.keys(data).length == 0) {
        let foundData = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1 })
        if (foundData.length == 0) return res.status(404).send({ status: false, message: "No data available" })
        foundData = foundData.sort((a,b)=>(a.title).localeCompare(b.title))
        return res.status(200).send({ status: true, message: foundData })
    }
    
    if(data.userId) { if(!mongoose.isValidObjectId(data.userId)) return res.status(400).send({ status: false, message: "Invalid userID" })}
    let expectedQueries = ["category", "subcategory", "userId"]
    let queries = Object.keys(data);
    let count = 0; 
    for (let i = 0; i < queries.length; i++) {
        if (!expectedQueries.includes(queries[i])) count++;
    }
    if (count > 0) return res.status(400).send({ status: false, message: "queries can only have userId,category and subcategory" })

    let foundData = await bookModel.find({ ...data, isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1 })
    if (foundData.length == 0) return res.status(404).send({ status: false, message: "No data found with given parameters" })
    foundData = foundData.sort((a,b)=>(a.title).localeCompare(b.title))
    return res.status(200).send({ status: true, message: foundData })

}

const getBookById = async function(req, res) {
    try {
        bookId = req.params.bookId

        if (!bookId) return res.status(400).send({ status: false, message: "Blog Id Is Needed" })

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId" })

        const bookData = await bookModel.findOne({ _id: bookId }).lean()
        if (!bookData) return res.status(404).send({ status: false, msg: "No Book Found With Given Book Id" })
    
        if (bookData.isDeleted == true) return res.status(404).send({ status: false, msg: "Book is Deleted" })
        
       
        let reviews = await reviewModel.find({ bookId: bookId })
        let data = {...bookData, reviewsData:reviews }

        return res.status(200).send({ status: "true", message: "Booklist", data: data })

    } catch (error) {

        return res.status(500).send({ msg: "Error", error: error.message })
    }
}



const updateBooks=async (req,res)=>{
    try{

  if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Please provide some data to update" }) 
    let bookId=req.params.bookId
  
    if(!bookId || bookId.trim()==""){
        return res.status(400).send({status:false,message:`please provide bookId in order to update..`})
    }
    if(!mongoose.isValidObjectId(bookId)){
        return res.status(400).send({status:false,message:`please provide valid bookId in order to update..`})
    }
   
    let isBookExist=await bookModel.findOne({_id:bookId,isDeleted:false}).select({userId:1})
    if(!isBookExist){
        return res.status(404).send({status:false,message:`sorry there is no book in database with provided bookId..`})
    }
    if(isBookExist.userId!=req.userId){
        return res.status(403).send({ status: false, message: "Unauthorized" });
    }
  
    let {...query}=req.body
    console.log(query)
    let {title,excerpt,ISBN,releasedAt}=req.body
    let queries=Object.keys(query)
    let validQueries=["title","excerpt","releasedAt","ISBN"]
    let count=0
    queries.forEach((x)=>{
        if(!validQueries.includes(x)){
            count++
        }
    })
    if(count>0){
    return res.status(400).send({status:false,message:`you can only update ${validQueries} attributes `})
    }
   if(req.body.title!=undefined && typeof(req.body.title)!=="string"){
    
    return res.status(400).send({ status: false, message: "Please enter valid title" })
   }
 
   if(req.body.excerpt!=undefined && typeof(req.body.excerpt)!=="string"){
    
    return res.status(400).send({ status: false, message: "Please enter valid excerpt" })
   }
    
   if( req.body.ISBN!=undefined && !isValidISBN(req.body.ISBN)){
    return res.status(400).send({ status: false, message: "Please enter valid ISBN" })

   }
    let isTitleExist=await bookModel.findOne({title:query.title,isDeleted:false})
    let isISBNExits=await bookModel.findOne({ISBN:query.ISBN,isDeleted:false})
    if(isTitleExist){
        return res.status(400).send({status:false,message:`plese check your title as there is already one document with same title...`})
    }
    if(isISBNExits){
        return res.status(400).send({status:false,message:`plese check your ISBN as there is already one document with same ISBN number...`})
    }
 if(title!=undefined)  query.title=query.title.trim()
 if(excerpt!=undefined)  query.excerpt=query.excerpt.trim()
 query.releasedAt=moment().format("YYYY-MM-DD")
    let updatedData=await bookModel.findOneAndUpdate({_id:bookId},query,{new:true})
    return res.status(200).send({status:true,message:`success`,data:updatedData})

    }
    catch(err){
        return res.status(500).send({status:false,err:err.message})
    }
}







const deleteById = async (req,res)=>{
   try{
    let bookId = req.params.bookId;
    if(!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Invalid bookId" })

    let foundBook = await bookModel.findById(bookId);
    if(!foundBook) return res.status(404).send({ status: false, message: "No Data Found to Delete" })

    if(foundBook.userId != req.userId)  return res.status(403).send({ status: false, message: "Unauthorized" });
   
    if(foundBook.isDeleted == true) return res.status(400).send({ status: false, message: "Book is Already Deleted" })
    foundBook = await bookModel.findOneAndUpdate({_id:bookId},{$set:{isDeleted:true}}) 

   return  res.status(200).send({status:true, message:"Book Deleted Successfully"})
}
catch (err) { return res.status(500).send({ status: false, Error: err.message })}
}



module.exports = { createBook, getBooks,getBookById ,updateBooks,deleteById}
