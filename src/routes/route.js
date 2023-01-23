const express=require('express')
const {createUser,userLogin}=require('../controllers/userController')
const {createBook,getBook} = require('../controllers/bookController')
const {authentication}=require('../middlewares/middleware')
const router=express.Router()

router.get('/test',function(req,res){
    res.send('hii group 3')
})


router.post('/register',authentication,createUser)

router.post('/login',authentication, userLogin)

router.post('/books',createBook)


router.all('/*',function(req,res){
    res.status(400).send({msg:"invalid Url request"})
})

module.exports=router