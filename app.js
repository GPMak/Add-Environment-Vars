//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require ('mongoose');
const encrypt = require ('mongoose-encryption');
 
const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended:true
}));

mongoose.connect("mongodb+srv://admin-galyna:Love2009@cluster0.wjdbdws.mongodb.net/userDB", { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log('connected'))
.catch(e=>console.log(e));

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

/*passing a single secret string for encryption. Creating a long unguessable string*/
/*const secret = "Thisisourlittlesecret.";*/ /* This is an example for Level 2 encryption. Move and reformat this to .env file when writing an example for dotenv lecture*/
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]}); /*This plugin should be added BEFORE creating a mongoose model!*/

const User = new mongoose.model ("User", userSchema);

 app.get("/", function(req, res){
    res.render("home");
 })
 app.get("/login", function(req, res){
    res.render("login");
 })
 app.get("/register", function(req, res){
    res.render("register");
 })
 
 /*I noticed the majority of the solutions being posted are using .then() syntax which is already older - the newer way
 to handle promises is to use async / await. Here's the code if anyone's curious - the explanation is in the API lectures.

 To me it is easier because you're using try / catch which is the standard error handling syntax in JS and Python 
so the code is more readable.*/

 app.post("/register", async (req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
   
    try {
      await newUser.save();
      res.render("secrets");
      console.log("New user saved.");
    } catch (err) {
      console.log(err);
    }
  });
   
  app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
   
    try {
      const foundUser = await User.findOne({ email: username });
      if (foundUser.password === password) {
        res.render("secrets");
      } else {
        console.log("Incorrect password - reloading page");
        res.render("login");
      }
    } catch (err) {
      console.log(err);
    }
  });

app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
})