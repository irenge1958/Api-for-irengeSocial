const express = require("express");
const helmet=require("helmet");
const morgan=require("morgan");
const app=express();
const mongoose=require('mongoose')
const userrouter=require("./route/user.js")
const postrouter=require("./route/post.js")
const authrouter=require("./route/Auth.js");
const tchatrouter=require("./route/tchat.js");
const dotenv=require('dotenv')
const multer  = require('multer')

dotenv.config()

mongoose.connect(process.env.code_db);
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use('/users',userrouter)
app.use('/Auth',authrouter)
app.use('/tchat',tchatrouter)
app.use('/post',postrouter)

app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../irengesocialapp/public/assets')
  },
  filename: function (req, file, cb) {

    cb(null, req.body.filename )
  }
})

const upload = multer({storage})
app.post('/upload', upload.single('file'), function (req, res) {
  console.log('Request body:', req.body.filename);
  console.log('Uploaded file:', req.file);
try{

res.status(200).send('successfully uploaded')
}catch(err){
console.log(err)
}
});
const storing = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/assets')
  },
  filename: function (req, file, cb) {

    cb(null, req.body.filename )
  }
})
const uploading=multer({storing})
app.post('/upload/profile', uploading.single('file'), function (req, res) {

try{

res.status(200).send('successfully uploaded')
}catch(err){
console.log(err)
}
});
app.listen(7000,()=>{
    console.log('listen on 7000')
})
