var express = require('express');
var client = require("mongodb").MongoClient;
var cookieparser=require("cookie-parser");
var bodyParser = require('body-parser');
var session=require("express-session");
var bcrypt=require("bcrypt");
const uid=require("uuid");
var app = express();
app.set('view engine','hbs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieparser());
app.use(session({
	secret:"nosecret",
	resave:true,
	saveUninitialized:true,
	cookie:{
		day:"tuesday",
		expires:new Date()
	}
}));

app.get("/",(req,res)=>{
	res.redirect('/heek');
})

app.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
})

app.get('/heek', function(req, res) {
	res.render('heek_home');
});


app.get('/signup',(req,res)=>{
	res.render('heek_signup');
});

app.post('/signup',(req,res)=>{
	var url="mongodb://localhost:27017/";
	client.connect(url,{ useNewUrlParser: true,useUnifiedTopology:true },(err,data)=>{
		if(err)
		{
			throw error;
		}
		var username=req.body.username;
		var password=req.body.password;
		console.log(`while creating account username is ${username}and password is ${password}`);
		bcrypt.hash(password,10,(err,hashpass)=>{
			if(!err)
			{
				data.db("heek").collection("users").findOne({username:username},(err,result)=>{
					if(result)
					{
						console.log("user exists");
						res.send("user exists");
					}
					else{
						data.db("heek").collection("users").insertOne({uid:uid.v1(),username:username,password:hashpass,createdate:new Date().toLocaleDateString(),createtime:new Date().toLocaleTimeString()},(err,result)=>{
							if(!err)
							{
								console.log("user added");
								res.redirect('/login');
							}
						})
					}
				})
			}
		})
	})
});	






app.get('/login',(req, res)=> {
	res.render("heek_login");
});

app.post("/login",(req,res)=>{
	var url="mongodb://localhost:27017/";
  client.connect(url,{ useNewUrlParser: true,useUnifiedTopology:true },(err,data)=>{
	if(err){
		throw error;
	}
	const username=req.body.username;
	const password=req.body.password;
	console.log(`while logging username is ${username} and password is ${password}`);
	data.db("heek").collection("users").findOne({username:username},(err,data)=>{
		if(data){
			var dbpassword=data.password;
			bcrypt.compare(password,dbpassword,(err,result)=>{
				if(result)
				{
				res.render("profile",{user:username});
				}
				else{
					res.send("wrong password");
				}
			});
		}
		else{
			res.send("try again bro");
		}
	})
})
})

app.listen(5000,()=>{
	console.log("Server is running at port 5000")
});




