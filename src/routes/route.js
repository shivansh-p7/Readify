const express=require('express')
const {createUser,userLogin}=require('../controllers/userController')
const {createBook,getBooks} = require('../controllers/bookController')
const {authentication, authorization}=require('../middlewares/middleware')
const router=express.Router()

router.post('/register',createUser)

router.post('/login',userLogin)

router.post('/books',authentication, authorization,createBook)

router.get('/books', authentication,getBooks)

router.all('/*',function(req,res){
    res.status(400).send({msg:"invalid Url request"})
})

module.exports=router