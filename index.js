// required packages
require("dotenv").config();
const express = require("express");

// app config
const app = express();
const PORT = process.env.PORT || 3030;
app.set("view engine", "ejs")

//middleware
app.use(express.urlencoded( { extended: false }));

//routes and controllers
app.get("/", (req, res) => {
    res.send("welcome to the auth api")
})

app.use("/users", require("./controllers/users.js"));


// listen port
app.listen(PORT, () => {
console.log(`We are live on port ${PORT} 🥲`);
})