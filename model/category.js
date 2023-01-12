const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    displayName: String,
    name: String,
    subCategory: Object,
    img: String
},
    {
        timestamps: true
    })

module.exports = mongoose.model("Category", categorySchema)
