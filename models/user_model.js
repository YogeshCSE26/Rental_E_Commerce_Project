
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const Listing = require("./listing_model.js");

const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },

    // We can add more field like:- name, age
    // However, username and password field already define by passport-local-mongoose
});

// console.log("Type of plugin:", typeof passportLocalMongoose);
// console.log("Actual plugin content:", passportLocalMongoose);

//  it will implement userName, Hashing, Salting and HashPasswords automatically
// So for these things no need to build from scratch
userSchema.plugin(passportLocalMongoose);

// userSchema.post("findOneAndDelete", async function (user) {
//     if (user) {
//         await Listing.deleteMany({ owner: user._id });
//         console.log(`Cascading Delete: All listings of deleted user "${user.username}" are cleared.`);
//     }
// });

module.exports = mongoose.model("User", userSchema);