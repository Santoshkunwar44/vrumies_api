const mongoose = require('mongoose');



const postModel = mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    VBTused: { type: Number, default: 0 },
    postImg: { type: Array, required: true, },
    websiteLink: String,
    price: { type: Number, required: true },
    category: { type: String, },
    subCategory: { type: String, },
    type: { type: String },
    orderNowBtn: { type: Boolean, default: false },
    onlineOnly: Boolean,
    location: { state: String, city: String, },
    isHidden: {
        type: Boolean,
        default: false
    },
    setLocation: Boolean,
    inventoryCount: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    }

},
    {
        timestamps: true
    })

module.exports = mongoose.model("Post", postModel)
