
const express = require("express");
const router = express.Router();

// Users - Model
// Route 2:- Index User Route
router.get("/", (req, res) => {
    res.send("GET for users");
});

// Route 3:- Show User Route
router.get("/:id", (req, res) => {
    res.send("GET for show user id");
});

// Route 4:- Post (New / Create) User Route
router.post("/", (req, res) => {
    res.send("POST for users");
});

// Route 5:- Delete User Route
router.delete("/:id", (req, res) => {
    res.send("DELETE for user id");
});

module.exports = router;