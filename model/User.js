const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    profileImg: { type: String, default: "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg" },
    tokenAvailabe: { type: Number, default: 0 },
    about: String,
    disputes: {
        type: Number,
        default: 0
    },
    ratings: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            rating: Number,
        }
    ],
    avgRating: {
        type: Number,
        default: 0
    },
    lastLoggedIn: Number,
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userModel)
