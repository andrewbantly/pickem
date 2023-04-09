// required packages for LEAGUES
const express = require("express");
const router = express();
const db = require("../models");


router.get("/", (req, res) => {
    res.send("see all leagues")
})



// export the router instance
module.exports = router;