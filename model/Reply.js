const mongoose = require('mongoose');


const replyModel = mongoose.Schema({
    title: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    vbtUsed: { type: Number, default: 4 }

}, {
    timestamps: true
})

module.exports = mongoose.model("Reply", replyModel)
