const express=require('express')
const router=express.Router()

router.get('/test',function(req,res){
    res.send('hii group 3')
})

router.all('/*',function(req,res){
    res.status(400).send({msg:"invalid Url request"})
})

module.exports=router