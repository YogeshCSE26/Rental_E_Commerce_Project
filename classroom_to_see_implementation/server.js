
const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
    console.log("server is listening to 3000");
});

// // Middleware 1:- Cookie Parser Middleware
// app.use(cookieParser("secretcode"));

// // Route 1:- Home Route
// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("Hi, I am root!");
// });

// // Route 2:- Cookies Route
// app.get("/getcookies", (req, res) => {
//     res.cookie("Greet", "Namaste");
//     res.cookie("MadeIn", "India");
//     res.send("Sent you some cookies!");
// });

// // Route 3:- Greet Route
// app.get("/greet", (req, res) => {
//     console.log(req.cookies);
//     let { name = "anonymous" } = req.cookies;
//     res.send(`Hi, ${name}! Welcome to the cookie world!`);
// });

// // Route 4:- Signed Cookies Route
// app.get("/getsignedcookie", (req, res) => {
//     res.cookie("Made-in", "India", { signed: true });
//     res.send("signed cookie sent!");
// });

// // Route 5:- Signed Cookies Verified
// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     console.log(req.cookies);
//     res.send("verified");
// });

// app.use("/users", users);
// app.use("/posts", posts);

// Middleware 2.2:- Session Middleware (Way 2.0 writing this)
// app.use(
//     session({
//         secret: "mysupersecretstring", 
//         resave: false, 
//         saveUninitialized: true
//     })
// );

// Middleware 2.1:- Session Middleware (Way 2.1 writing this)
const sessionOptions = {
    secret: "mysupersecretstring", 
    resave: false, 
    saveUninitialized: true
};

// Middleware 2.2:- Session Middleware (Way 2.2 writing this)
app.use(session(sessionOptions));

// Middleware 3:- Flash Middleware
app.use(flash());

// Middleware 4:- Custom Middleware to set flash messages in res.locals
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// Route 6:- Test Route
// app.get("/test", (req, res) => {
//     res.send("test successful!");
// });

// Route 7:- Request Count
// app.get("/reqcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     };
//     res.send(`You have sent a request ${req.session.count} times`);
// });

// Route 8:- Register Route
app.get("/register", (req, res) => {
    let { name = "Anonymous" } = req.query;
    // console.log(req.session);
    req.session.name = name;
    // console.log(req.session.name);
    // res.send(`Welcome, ${name}! You are registered successfully!`);
    // req.flash("success", "user registered successfully!");

    if(name === "Anonymous") {
        req.flash("error", "user not registered!");
        return res.redirect("/hello");
    } else {
        req.flash("success", "user registered successfully!");
    };

    // req.flash("error", "user not registered!");
    res.redirect("/hello");
});

// Route 9:- Hello Route
app.get("/hello", (req, res) => {
    // res.send(`hello, ${req.session.name}`);
    // console.log(req.flash("success"));
    // res.locals.successMsg = req.flash("success"); // Shifted to middleware 4
    // res.locals.errorMsg = req.flash("error"); // Shifted to middleware 4

    // res.render("page.ejs", {name: req.session.name, msg: req.flash("success")});
    res.render("page.ejs", { name: req.session.name });
});