
const Listing = require("../models/listing_model");
const User = require("../models/user_model.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    // Listing.find({}).then((res) => {
    //     console.log(res);
    // }).catch((err) => {
    //     console.log(err);
    // });

    // 1. First, fetch the IDs of all remaining valid users from Atlas.
    const validUsers = await User.find({}, "_id");
    const validUserIds = validUsers.map(user => user._id.toString());

    // 2. AUTOMATION: Delete all listings where the owner is invalid or null.
    const cleanUpResult = await Listing.deleteMany({
        $or: [
            { owner: { $nin: validUserIds } }, // The Owner's ID does not exist in the users collection.
            { owner: null },                   // The Owner has directly become null.
            { owner: { $exists: false } }      // The Owner field itself is missing.
        ]
    });

    // If anything gets deleted on the backend, it will be visible in the terminal.
    if (cleanUpResult.deletedCount > 0) {
        console.log(`[Auto-Clean] ${cleanUpResult.deletedCount} orphaned listings automatically cleared!`);
    }

    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", 
            populate: {
                path: "author",
            },
        }).populate("owner");

    // Check if the listing is null then create flash message.
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };

    console.log(listing);

    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();

    // check listingSchema in single way
    // let result = listingSchema.validate(req.body);
    // console.log(result);

    // if(result.error) {
    //     throw new ExpressError(400, result.error);
    // };

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", "filename");

    const newListing = new Listing(req.body.listing);
    
    // If user left empty image url, then by default image will take this
    // if (!newListing.image.url || newListing.image.url === "") {
    //     newListing.image = {
    //         url: `https://picsum.photos/800/600?random=${Math.random()}`
    //     };
    // };

    // console.log(req.user);

    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    // Check if the listing is null then create flash message.
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    // To check valid data for listing from client side Post request
    // "if(!req.body.listing)" instead of this need to write if like this as below mention
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    // };

    let { id } = req.params;
    // let { listing } = req.body;

    // Converting "listing.image" String into Object
    // if (typeof listing.image === "string") {
    //     listing.image = { url: listing.image };
    // } // commenting out this because in new.ejs file image input section, we updated this:- name="listing[image][url]"

    // shifted this code to middleware
    // let listing = await Listing.findById(id);

    // if(!listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/listings/${id}`);
    // };
     
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // await Listing.findByIdAndUpdate(id, {...listing});

    // In JavaScript, we use the typeof operator to check whether a variable's value is undefined.
    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    };

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};