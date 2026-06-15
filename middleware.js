
const Listing = require("./models/listing_model.js");
const Review = require("./models/review_model.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

// Middleware Function 1:- isLoggedIn
module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user);
    // console.log(req);
    // console.log(req.path, "..", req.originalURL);

    if(!req.isAuthenticated()) {
        // redirectURL save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    };
    next();
};

// Middleware Function 2:- saveRedirectUrl
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    };
    next();
};

// Middleware Function 3:- isOwner
module.exports.isOwner = async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    };
    next();
};

// Middleware 4:- for validateListing
module.exports.validateListing = (req, res, next) => {
    // check listingSchema in single way
    let { error } = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    };
};

// Middleware 5:- for validateReview
module.exports.validateReview = (req, res, next) => {
    // check listingSchema in single way
    let { error } = reviewSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    };
};

// Middleware Function 6:- isReviewAuthor
module.exports.isReviewAuthor = async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    };
    next();
};