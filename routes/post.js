const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const requiredLogin = require('../middleware/requiredLogin')
const Post = mongoose.model("Post")

router.get('/allpost',(req,res)=>{

    Post.find({})
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requiredLogin,(req,res)=>{

    Post.find({postedBy: req.user._id})
    .populate("postedBy","_id name")
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})



router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body} = req.body
    if(!title || !body){
        return res.status(422).json({error:"please add all field"})
    }

    req.user.password = undefined
    req.user.email = undefined

    const post = new Post({
        title,
        body,
        postedBy: req.user
    })

    post.save().then(result=>{
        res.json({post:result})
        console.log(result)
    })
    .catch(err=>{
        console.log(err)
    })

})

module.exports = router