
if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
};

// console.log(process.env.SECRET);

const express = require("express");
const app = express();

// Setup Mongoose connection
const mongoose = require("mongoose");

// Path requiring for EJS
const path = require("path");

// requiring method-override package after installing
const methodOverride = require("method-override");

// Requiring EJS-Mate
const ejsMate = require("ejs-mate");

// Requiring ExpressError
const ExpressError = require("./utils/ExpressError.js");

// Requiring Express Session Package
const session = require("express-session");
const MongoStore = require('connect-mongo').default || require('connect-mongo');

// Requiring connect-flash
const flash = require("connect-flash");

// Requiring Passport
const passport = require("passport");

// Requiring Passport-Local
const LocalStrategy = require("passport-local");

// Requiring User.js Object
const User = require("./models/user_model.js");

// Requiring listing + review + user Router.js object
const listingRouter = require("./routes/listing_route.js");
const reviewRouter = require("./routes/review_route.js");
const userRouter = require("./routes/user_route.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connecting Database:- now it is online MongoDB Atlas cloud
const dbUrl = process.env.ATLASDB_URL;

// console.log(dbUrl);

// Running Server
app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

// Calling Main Function
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// Connecting with MongoDB database
async function main() {
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
};

// These two lines code means, our views_for_EJS folder is 
// ready to save all EJS templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parsing data Form Data with URL-encoded :- which is inside the request
app.use(express.urlencoded({extended: true}));

// using method-override
app.use(methodOverride("_method"));

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate); // just like include and partials

// Using Static Files:- like CSS and JS, from where it will be served
app.use(express.static(path.join(__dirname, "/public")));

// let storeMethod = MongoStore.create;

// // Agar direct .create nahi mila, toh ho sakta hai wo .default ke andar ho
// if (!storeMethod && MongoStore.default && typeof MongoStore.default.create === 'function') {
//     storeMethod = MongoStore.default.create.bind(MongoStore.default);
// }

// // 2. Ab store ko create karenge safely
// const store = storeMethod({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET || "mysupersecretcode",
//     },
//     touchAfter: 24 * 3600, // seconds mein
// });

// Middleware 1.1:- Using Mongo Store (New Method)
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

// if any error get in Atlas cloud storage
store.on("error", (error) => {
    console.log("Error in Mongo Session Store", error);
});

// Middleware 1.2:- Define session option:- Define sessionOptions as a variable
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // it's a 1 week time:- 
        // Days-> Hours -> Sixty minutes -> Sixty Seconds -> 1000 mili seconds under 1 week
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

// Route 1:- Basic API Root Route
// app.get("/", (req, res) => {
//     res.send("Hi, I'm root");
//     // console.log("Server is working");
// });

// Middleware 1.3 :- Using Session option Secret:- Required option
app.use(session(sessionOptions));

// using connect-flash
// and one more thing we need to use this flash before requiring any routes like listing and review
app.use(flash());

// Here, we use passport.initialize() as middleware
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware 2:- for flash message
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    // console.log(res.locals.success);

    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Route 2:- Demo User (and Passport already written registration logic)
// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     // register is static method
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });

// PASTE THIS TEMPORARY CLEAN-UP ROUTE HERE:
// app.get("/clear-all-orphaned", async (req, res) => {
//     try {
//         const Listing = require("./Models/Listings_Models.js"); // Check the correct path (Models or models)

//         // Delete directly using the actual ID visible in the terminal
//         const result = await Listing.deleteOne({ _id: "68d5100e88abe99ef5bbe309" });

//         console.log(`Force Deleted Count: ${result.deletedCount}`);
//         res.send(`<h1>Success!</h1><p>Kharab listing (ID: 68d5100e88abe99ef5bbe309) It has been deleted! Deleted Count: ${result.deletedCount}</p>`);
//     } catch (err) {
//         console.log("Force Delete Error:", err);
//         res.status(500).send("Error: " + err.message);
//     }
// });

// All Listings + Reviews + Users Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Express's Middleware 3:- Catch-all Route Handler 
// (To check if route exist or not if not in that case handle a error)
// Sending Standard Response if Route not matched
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// Express's Middleware 4:- Async Error handling Middleware
app.use((err, req, res, next) => {
    // res.send("Something went wrong!"); // standard error response
    
    // D-constructing our ExpressError
    let { statusCode = 500, message = "Internal Server Error" } = err;
    // res.status(statusCode).send(message);

    res.status(statusCode).render("error.ejs", { message });
    // res.render("error.ejs", { err });
});