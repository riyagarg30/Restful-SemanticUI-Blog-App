var express=require("express");
var app=express();
var methodOverride=require("method-override");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var expressSanitizer=require("express-sanitizer");


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//heroku database
//"mongodb+srv://riyagarg30:rg3005pass@cluster0.y5py7.mongodb.net/SemanticUIBlogApp?retryWrites=true&w=majority"
// mongoose.connect("mongodb+srv://riyagarg30:rg3005pass@cluster0.y5py7.mongodb.net/SemanticUIBlogApp?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log('Connected to DB!'))
//   .catch(error => console.log(error.message));


//local database
mongoose.connect('mongodb://localhost/semantic_blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

/*Blog.create({
    title: "Test Blog",
    image: "https://images.unsplash.com/photo-1498227953826-450c4200f708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
    body: "This is a test blog"
});*/

app.get('/', (req, res) => {
    res.redirect("/blogs");
});


//INDEX Route
app.get('/blogs', (req, res) => {
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});

//New Route
app.get('/blogs/new', (req, res) => {
    res.render("new");
});

//Create Route
app.post('/blogs', (req, res) => {
    req.body.blog.body=req.sanitize(req.body.blog.body);
    var newBlog=req.body.blog;
    Blog.create(newBlog);
    res.redirect("/blogs");
});

//Show Route
// app.get('/blogs/:id', (req, res) => {
//     Blog.findById(req.params.id, (err, foundBlog) => {
//             if (err) {
//                 console.log("Blog not found");
//             }

//             else {
//                 res.redirect("show", {blog:foundBlog });
//             }
//         });
// });

app.get('/blogs/:id', (req, res) => {
    Blog.findOne({_id: req.params.id},function(err,blog){
        if(err){
            console.log(err);
        }else{
            //console.log(blog);
            res.render("show",{blog:blog});
        }
    });
});

//Edit Route

app.get('/blogs/:id/edit', (req, res) => {
    Blog.findOne({_id: req.params.id}, function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{blog:foundBlog});
        }
    })
});

//Update Route
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//Delete Route

// app.delete('/blogs/:id', (req, res) => {
//     Blog.findByIdAndRemove(req.body.id,(err) => {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 console.log("Blog Deleted");
//                 res.redirect("/blogs");
//             }
//         });
// });

app.delete('/blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
            //res.render("index");
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('App listening on port 3000!');
});