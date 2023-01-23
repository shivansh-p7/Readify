const express=require('express')
const {createUser,userLogin}=require('../controllers/userController')
const router=express.Router()

router.get('/test',function(req,res){
    res.send('hii group 3')
})

router.post('/register',createUser)

router.all('/*',function(req,res){
    res.status(400).send({msg:"invalid Url request"})
})

module.exports=router