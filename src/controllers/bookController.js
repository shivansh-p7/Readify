const bookModel = require("../Models/bookModel");
const userModel = require("../Models/userModel");
const mongoose = require('mongoose')
const moment = require("moment")
const isValidISBN = require("isbn-validate")
const { isValidExcerpt, isValidTitle } = require('../Validators/validatte');

const createBook = async (req, res) => {
    try {
        let bookData = req.body
        if (Object.keys(bookData).length == 0) return res.status(400).send({ status: false, message: "Please put book data" })

        let { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookData

        if (!title || title.trim() == "") return res.status(400).send({ status: false, message: "Please enter book title" })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: "Please enter valid title" })
        let isTitleExits = await bookModel.findOne({ title: title })
        if (isTitleExits) return res.status(400).send({ status: false, message: "Title already exits" })

        if (!excerpt || excerpt.trim() == "") return res.status(400).send({ status: false, message: "Please enter book excerpt" })
        if (!isValidExcerpt(excerpt)) return res.status(400).send({ status: false, message: "Please enter valid excerpt" })

        if (!userId || userId.trim() == "") return res.status(400).send({ status: false, message: "Please enter book userId" })
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "please enter valid userID" })

        if (!ISBN || ISBN.trim() == "") return res.status(400).send({ status: false, message: "Please enter book ISBN" })
        if (!isValidISBN.Validate(ISBN)) return res.status(400).send({ status: false, message: "Please enter valid ISBN" })
        let isISBNExits = await bookModel.findOne({ ISBN: ISBN })
        if (isISBNExits) return res.status(400).send({ status: false, message: "ISBN already exits" })

        if (!category || category.trim() == "") return res.status(400).send({ status: false, message: "Please enter book category" })

        if (!subcategory || subcategory.trim() == "") return res.status(400).send({ status: false, message: "Please enter book subcategory" })

        releasedAt = moment().format("YYYY-MM-DD")
        bookData.releasedAt = releasedAt;

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

module.exports = { createBook, getBooks }
