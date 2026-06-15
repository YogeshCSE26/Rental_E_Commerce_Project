
const Listing = require("../models/listing_model");
const Review = require("../models/review_model");

module.exports.createReview = async (req, res) => {
    // console.log(req.params.id);

    // Accessing the particular listing where we want to add review
    let listing = await Listing.findById(req.params.id);

    // Safety Check: if listing is null then need to handle an error
    // if (!listing) {
    //     throw new ExpressError(404, "Listing not found!");
    // };

    // Check if the listing is null.
    // if (!listing) {
    //     // You can also use a flash message here later
    //     return res.redirect("/listings");
    // };

    // Creating new reviews
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    // console.log(newReview);

    // to save something inside the existing database then we use .save() function
    // which is already async function itself
    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");

    // res.status(200).send("Review saved in DB and everything is fine!");

    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);    
};

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};