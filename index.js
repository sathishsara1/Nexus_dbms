const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname + "/public")));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
var admin = false;
var login = false;
redirect = '';
//mongoose connection 
mongoose.connect("mongodb+srv://sathishsara1007:Sathish%40111@cluster0.f5vy3xz.mongodb.net/Nexus").then(() => {
    console.log("Connected to Database");
});
//mongoose schema and model 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin : {
        type : Boolean
    }
});
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    bookLink: {
        type: String,
        required: true
    }
});
const feedBackSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    feedback:{
        type:String,
        required:true
    }
});
result2 = "Login/signup↗";
result = "LOGIN"
head = "NEXUS";
const feedBackModel = mongoose.model("feedbacks",feedBackSchema);
const bookModel = mongoose.model("books", bookSchema);
const biographies = mongoose.model("biographies", bookSchema);
const story = mongoose.model("story", bookSchema);
const userModel = mongoose.model("users", userSchema);
app.get('/', (req, res) => {
    res.render("home", { result: "HELLO" })
})
app.get("/register", (req, res) => {
    res.render("register", { result: "LOGIN" })
})
app.get("/login", (req, res) => {
    res.render("login", { result: "LOG IN" })
})

    // app.get("/about", (req, res) => {
    //     res.render("about")
    // })
    // app.get("/contact", (req, res) => {
    //     res.render("contact",{result:''})
    // })
    // app.get("/store", (req, res) => {
    //     res.render("store")
    // })
    app.get('/add',(req,res) => {
        res.render("addbook")
    })
    app.get('/update',(req,res) => {
        res.render("updatebook")
    })
    app.get('/delete',(req,res) => {
        res.render("deletebook")
    })

app.post("/register", async (req, res) => {
    const { email, name, password, collegeName } = req.body;
    const user = await userModel.findOne({ email: email });
    if (user) {
        res.render('register', { result: "Already Registered! Please Login" });
    }
    else {
        const newUser = new userModel({
            email: email,
            password: password,
            name: name,
            collegeName: collegeName
        });
        newUser.save();
        res.render("register", { result: "Successfully Registerd! Please Login" });
    }
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        res.render('register', { result: "User Not Found Please register" })
    }
    else {
        if (user.password !== password) {
            result = "Incorrect Password"
            res.render('register', { result: "Incorrect Password Try Again" })
        }
        else {
            if(user.admin === true)
            {
                admin = true;
            }
            result = "Succesfully Logged In"
            // now open all pages only if this variable is true
            login = true;
            head =  user.name;
            result2 = "Logout";
            res.render('home', { result1: `Welcome ${user.name}` })
        }
    }
})
app.post("/logout",(req,res)=>{
    login = false;
})
function checkLoginStatus(req, res, next) {
    if (login) {
      next();
    } else {
      res.redirect('/register');
    }
  }
app.get("/about",checkLoginStatus, (req, res) => {
    res.render("about")
})
app.get("/contact", checkLoginStatus,(req, res) => {
    res.render("contact",{result:''})
})
app.get("/store",checkLoginStatus, (req, res) => {
    res.render("store")
})
app.post("/addAdmin",async (req,res)=>{
    const usermail = req.body.mail;
    await userModel.findOneAndUpdate({email:usermail},{admin:true});
    // andaka petta after frontend change this to desired route
    res.redirect("/");
})
app.post("/postFeedBack",async (req,res)=>{
    const {email,name,feedback} = req.body;
    console.log(email,name,feedback);
    const newFeedBack = new feedBackModel({
        email:email,
        name:name,
        feedback:feedback
    });
    const r = await newFeedBack.save();
    console.log(r);
    res.render("contact",{result:"Thanks for the feedBack"})
})

app.post("/postBooks", async (req, res) => {
    try {
        const { title, description, pages, bookLink } = req.body;
        const newBook = new bookModel({
            title: title,
            description: description,
            pages: pages,
            bookLink: bookLink
        })
        await newBook.save();
    }
    catch (err) {
        res.status(500);
    }
})
app.post("/postBooks", async (req, res) => {
    try {
        const { title, description, pages, bookLink } = req.body;
        const newBook = new biographies({
            title: title,
            description: description,
            pages: pages,
            bookLink: bookLink
        })
        await newBook.save();
    }
    catch (err) {
        res.status(500);
    }
})
app.post("/postBooks", async (req, res) => {
    try {
        const { title, description, pages, bookLink } = req.body;
        const newBook = new story({
            title: title,
            description: description,
            pages: pages,
            bookLink: bookLink
        })
        await newBook.save();
    }
    catch (err) {
        res.status(500);
    }
})
app.get("/getBooks", async (req, res) => {
    try {
        const books = await bookModel.find({});
        res.render("books", { bookdata: books })
    }
    catch (err) {
        console.err(err);
    }
});
app.get("/getBooks1", async (req, res) => {
    try {
        const books = await biographies.find({});
        res.render("books", { bookdata: books })
    }
    catch (err) {
        console.err(err);
    }
});
const list = ["sathishsara1007@gmail.com","123@gmail.com"]
app.post("/addNewBooks",async (req,res)=>{
    redirect = '';
    const mail = req.body.email;
    const result = new bookModel({
        title : req.body.title,
        description : req.body.description,
        pages : req.body.pages,
        bookLink : req.body.bookLink
    }) 
    if (list.includes(mail)){
        redirect = '';
        result.save();
        res.redirect("/store");
    }
    else{
        redirect = "You are not an admin to make Operations in the Website. If you want admin access kindly message to sathishsara1007@gmail.com";
        res.render("addbook");
    }
})

app.post("/updateNewBook",async(req,res)=>{
    redirect = '';
    const mail = req.body.email;
    const queryTitle = req.body.title;
    const newdetails = {
        title : req.body.newtitle,
        description : req.body.newdesc,
        pages : req.body.newpages,
        bookLink : req.body.newbookLink
    }
    
    if (list.includes(mail)){
        redirect = '';
        const result = await bookModel.findOneAndUpdate({title:queryTitle},newdetails);
        result.save();
        res.redirect("/store");
    }
    else{
        redirect = "You are not an admin to make Operations in the Website. If you want admin access kindly message to sathishsara1007@gmail.com";
        res.render("updatebook");
    }
})
app.post("/deleteABook",async(req,res)=>{
    redirect = '';
    const mail = req.body.email;
    const title = req.body.title;
    if (list.includes(mail)){
        redirect = '';
        await bookModel.deleteOne({title:title});
    res.redirect("/store");
    }
    else{
        redirect = "You are not an admin to make Operations in the Website. If you want admin access kindly message to sathishsara1007@gmail.com";
        res.render("deletebook");
    }
    
})
app.get("/getBooks2", async (req, res) => {
    try {
        const books = await story.find({});
        res.render("books", { bookdata: books })
    }
    catch (err) {
        console.err(err);
    }
});
app.listen(3000, () => {
    console.log("Listening!", PORT);
})
