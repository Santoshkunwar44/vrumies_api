require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const passport = require("passport")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")


app.use(cors({
    origin: [
        "https://luxury-pika-c9a6da.netlify.app",
        "http://localhost:3000"
    ],
    methods: ["POST,PUT,GET,DELETE"],
    credentials: true,
}))
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan("common"))
require("./services/db/connectDb")()
require("./services/passport/passport")

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 1000 * 60 * 60 * 10,
    collectionName: "vrumies_session"
})


app.use(session({
    name: "vrumies.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    store,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 1000 * 60 * 60 * 1,
        httpOnly: true,
        sameSite: "none"
    },
}))


app.use("/api/post", require("./routes/post"))
app.use("/api/user", require("./routes/user"))
app.use("/api/reply", require("./routes/reply"))
app.use("/api/category", require("./routes/category"))
app.use("/api/transaction", require("./routes/transaction"))
app.use("/api/passport", require("./routes/passport"))



app.listen(8000, () => console.log("server started at port 8000"))

