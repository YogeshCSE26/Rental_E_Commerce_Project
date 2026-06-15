
const express = require("express");
const router = express.Router();

// Posts - Model
// Route 1:- Index Post Route
router.get("/", (req, res) => {
    res.send("GET for posts");
});

// Route 2:- Show Post Route
router.get("/:id", (req, res) => {
    res.send("GET for show post id");
});

// Route 3:- Post (New / Create) Post Route
router.post("/", (req, res) => {
    res.send("POST for posts");
});

// Route 4:- Delete Post Route
router.delete("/:id", (req, res) => {
    res.send("DELETE for post id");
});

module.exports = router;