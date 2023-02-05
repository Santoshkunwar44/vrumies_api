require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const passport = require("passport")


app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        'http://localhost:3000'
    ],
    methods: ["POST,PUT,GET,DELETE,PUT,OPTIONS"],
    credentials: true
}))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.set("trust proxy", 1)


app.use(cookieParser())
app.use(express.json())
app.use(morgan("common"))

require("./services/db/connectDb")()
require("./services/passport/passport")

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 31556952000,
    collectionName: "vrumies_session",
    autoRemove: 'native',
})


app.use(session({
    name: "vrumies.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,
        maxAge: 31556952000,
        httpOnly: true,
        sameSite: "None",
    },
    store,
}))

app.use(passport.initialize())
app.use(passport.session())


app.use("/api/passport", require("./routes/passport"))
app.use("/api/post", require("./routes/post"))
app.use("/api/user", require("./routes/user"))
app.use("/api/category", require("./routes/category"))
app.use("/api/reply", require("./routes/reply"))
app.use("/api/payment", require("./routes/payment"))
app.use("/api/transaction", require("./routes/transaction"))


app.listen(8000, () => console.log("server started at port 8000"))

