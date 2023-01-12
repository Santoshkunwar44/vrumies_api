require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const morgan = require("morgan")


app.use(cors({
    origin: "*",
    methods: ["POST,PUT,GET,DELETE"],
    credentials: true,
}))

app.use(express.json())
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
    },
}))


app.use("/api/post", require("./routes/post"))
app.use("/api/user", require("./routes/user"))
app.use("/api/reply", require("./routes/reply"))
app.use("/api/category", require("./routes/category"))
app.use("/api/transaction", require("./routes/transaction"))
app.use("/api/passport", require("./routes/passport"))



app.listen(8000, () => console.log("server started at port 8000"))

