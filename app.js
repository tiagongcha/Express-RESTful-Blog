var express = require("express");
app = express();
// config app to use body-parser:
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
// set resources view engien
app.set("view engine", "ejs");
app.use(express.static("public"));
// set method override
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
// create database
var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/restful_blog");
mongoose.connect("mongodb://tia:coltsb520@ds151809.mlab.com:51809/restful_blog");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected");
});

// initiate the blogSchema class
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);
// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1545696647-804fd9ed2e2e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	body: "Hello this is a blog post about cafe"
// });

//*********************RESTful Routes*********************//
// Index Route:
app.get("/", function(req, res){
	res.redirect("/blogs");
});
app.get("/blogs", function(req, res){
	//Get all data from db and render that file:
	Blog.find({}, function(err, allBlogs){
		if(err){
			console.log("err in loading all data from database");
		}else{
			res.render("index", {blogs: allBlogs});
		}
	})
});
//New Route -> form
app.get("/blogs/newBlog", function(req, res){
	res.render("newBlog");
});

//Create Route
app.post("/blogs", function(req, res){
	//creat an blog obj with user submitted data:
	var newBlog = req.body.blog;

	Blog.create(newBlog, function(err, newBlog){
		if(err){
			console.log("user input form item is wrong, cant be saved in database");
		}else{
			//if successfully saved in DB, redirect user to background
			res.redirect("/blogs");
		}
	});
});

//Show Route:
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("error in getting id info in database");
			res.redirect("/blogs");
		}else{
			res.render("show", {blog: foundBlog});
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit", {blog: foundBlog});
		}
	})
});

//Update Route:
app.put("/blogs/:id", function(req, res){
	var newBlog = req.body.blog;

	Blog.findOneAndUpdate(req.params.id, newBlog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

//Delete Route:
app.delete("/blogs/:id", function(req, res){
 	Blog.findOneAndRemove(req.params.id, function(err, removedBlog){
		if (err) {
			console.log("delete err from db");
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
})

//listening server on port 3000
app.listen(3000, ()=>{
	console.log("blog app server is running");
})