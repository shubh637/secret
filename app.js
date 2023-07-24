//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const app=express();
const encrypt=require("mongoose-encryption");
const mongoose=require("mongoose");
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/userdb",{useNewUrlParser:true});
const userschema=new mongoose.Schema({
    email:String,
    password:String
})
//importing the value from environment variable.
userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"]});//plugin the encryptand secret for the specific field
const User=new mongoose.model("User",userschema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    const newUser= new User({
        email:req.body.username,
        password:req.body.password
    });
   newUser.save(function(err){
    if(err){
        console.log(err);
    }
    else{
        res.render("secrets");
    }
   })
});
app.post("/login" ,function (req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username}).then((foundUser)=>{
       if(foundUser.password===password){
        res.render("secrets.ejs");
       }
    }).catch((err)=>{
        console.log(err);
    });
})
app.listen(3000,function(req,res){
    console.log("server is running");
});
