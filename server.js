const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')

require('./models/user')
require('./models/post')

mongoose.model("User")

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected',()=>{
    console.log("Connected to MongoDB Successfull")
})

mongoose.connection.on('error',()=>{
    console.log("Error to connect",err)
})


app.get('/',(req,res)=>{
    res.send("Hello World")
    console.log("home respond")
})


app.listen(port,()=>console.log("Server connected to port",port))