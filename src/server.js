const express =require('express');
//const path=require('path');
const app =express();
const bodyparser=require('body-parser');
const cookie=require('cookie-parser');
const session = require('express-session');
const uid=require("uuid");



app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookie());
app.use(session({ 
  secret:"daniyal",
  resave:false,
  saveUninitialized:false,
  loggedIn:false,
  }))


//const public= path.join(__dirname,'../public');

//app.use(express.static(public));
app.set("view engine","hbs");
//app.set('views','./views');

app.get("/",(req,res)=>{
  res.send("home page");
})

app.get("/heek",(req,res)=>{
  if (req.session.loggedIn){
    res.send(`you visited  heek blah times`)
  }
  else{
    req.session.loggedIn=true;
    res.write("welcome  to heek for first time");
    //res.write(uid.v4());
    res.write(uid.v1());
    //res.write(uid.v3());
    //res.write(uid.v5());
    res.end();
  }
  //res.render("profile",{user:"danny"});
})

app.get("/logout",(req,res)=>{
  req.session.loggedIn=false;
  res.redirect("/");
})
app.listen(2000,()=>{
  console.log("running at port 2000");
});

