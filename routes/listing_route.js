
const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing_model.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings_controller.js");

const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' }); // This line work for localhost pc
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,        
        upload.single("listing[image]"), 
        validateListing, 
        wrapAsync(listingController.createListing)
    );
//     .post(upload.single("listing[image]"), (req, res) => {
//         res.send(req.file);
//     }
// );

// Route 5:- Create / New Route, this route should be write before show route no.4
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn, 
    isOwner, 
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)
);

// Route 7:- Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;