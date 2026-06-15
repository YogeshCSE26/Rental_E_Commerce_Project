
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review_model.js");

// Basic Schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    // image: {
    //     type: String,
    //     // Default is for testing for backend developer
    //     default: 
    //         "https://unsplash.com/photos/brown-concrete-building-near-body-of-water-during-daytime-Q7xoPRzWAuw",
        
    //     // set is for client side default image
    //     set: (v) => 
    //         v === "" 
    //             ? "https://unsplash.com/photos/brown-concrete-building-near-body-of-water-during-daytime-Q7xoPRzWAuw" 
    //             : v,
    // },

    image: {
        filename: String,
        url: String,
    },

    price: {
        type: Number,
        // required: [true, "Price is mandatory!"],
        // min: 0,
    },

    location: {
        type: String,
    },

    country: {
        type: String,
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
        },

        coordinates: {
            type: [Number],
            required: true,
        },
    },

    // category: {
    //     type: String,
    //     enum: ["mountains", "rooms", "farms", "arctic", "deserts"],
    // },
});

// Mongoose Middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews}});
    };
});

// Creating Model
const Listing = mongoose.model("Listing", listingSchema);

// Exporting Model
module.exports = Listing;