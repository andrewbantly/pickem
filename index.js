// required packages
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cryptoJs = require("crypto-js");
const db = require("./models")

// app config
const app = express();
const PORT = process.env.PORT || 3030;
app.set("view engine", "ejs")

//middleware
app.use(express.urlencoded( { extended: false }));
app.use(cookieParser())
app.use((req, res, next) => {
    // console.log("the middleware has been invoked.");
    // incoming request console logger
    console.log(`[${new Date().toLocaleString()}]: ${req.method} ${req.url}`)
    console.log("request body: ", req.body)
    // send data downstream to the other routes
    // res.locals.myData = "howdy 👋🏼 partner 🤠";
    next() // tells express that this middleware has finished
})
app.use(async (req, res, next) => {
    try {
        // check if there is a cookie
        if (req.cookies.userId) {
            // if so we will decrypt the cookie and lookup the user using their PK
            const decryptedPK = cryptoJs.AES.decrypt(req.cookies.userId, process.env.ENC_KEY);
            const decryptedPKString = decryptedPK.toString(cryptoJs.enc.Utf8);
            const user = await db.user.findByPk(decryptedPKString) // eager loading can be done here
            // mount the found user on the res.locals
            // in all other routes you can assume that the res.locals.user is the currently logged in user
            res.locals.user = user;
            // res.locals.user.addBet({}) !!! how we only allow the loged in user to add a bet to their profile
        } else {
            // if there is no cookie, set the res.locals.user to be null
            res.locals.user = null;
        }
    } catch (error) {
        console.log(error)
        // if something goes wrong, set the user in the res.locals to be null
        res.locals.user = null;
    } finally {
        // runs regardless of whether there was an error or not
        next() // tells express this middleware has finished, go to the next thing
    }
})

//routes
app.get("/", (req, res) => {
    console.log(res.locals)
    res.render("index.ejs")
})

// controllers
app.use("/users", require("./controllers/users.js"));

app.get("*", (req, res) => {
    res.render("404")
})

// listen port
app.listen(PORT, () => {
console.log(`We are live on port ${PORT} 🥲`);
})