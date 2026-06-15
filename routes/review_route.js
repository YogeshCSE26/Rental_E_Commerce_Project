
const express = require("express");
const router = express.Router({mergeParams: true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review_model.js");
const Listing = require("../models/listing_model.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews_controller.js");

// Route 10:- Reviews (POST Route)
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Route 11:- Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;