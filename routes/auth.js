const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')
const requiredLogin = require('../middleware/requiredLogin')



router.get('/',(req,res)=>{
    res.send('this is auth')
})

router.get('/permit',requiredLogin,(req,res)=>{
    res.send('you have authorization')
})


router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body

    if(!name){
        return res.status(422).json({error:"please add name"})
    }
    if(!email ){
        return res.status(422).json({error:"please add email"})
    }
    if(!password){
        return res.status(422).json({error:"please add password"})
    }

    User.findOne({email: email})
        .then((savedUser)=>{
            if(savedUser){
                return res.status(422).json({error:"user already exist"})
            }
            bcrypt.hash(password,12)
            .then(hashedpassword =>{
                const user = new User({
                    email,
                    name,
                    password: hashedpassword
                })
                user.save()
                .then( user=>{
                    res.json({message:"save successfull"})
                })
                .catch(error=>{
                    console.log(error)
                })
            })
        })
        .catch(error=>{
            console.log(error)
        })

})

router.post('/signin',(req,res)=>{
    const{email,password} = req.body

        User.findOne({email: email})    
        .then(savedUser=>{
            if(!savedUser){
                return res.status(422).json({error:"not found email"})
            }

            bcrypt.compare(password,savedUser.password)
            .then(doMatch =>{
                if(doMatch){
//                    res.json({message:"signin successfull"})
                    const token = jwt.sign({_id: savedUser._id},JWT_SECRET)
                    const {_id,name,email} = savedUser
                    res.json({token,user:{_id,name,email}})

                }
                else{
                    return res.status(422).json({error:"invalid email or password"})
                }
            })
            .catch(error=>{
                console.log(error)
            })
        })
})

module.exports = router