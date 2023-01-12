const mongoose = require("mongoose")


async function connectToDbFunc() {

    try {

        mongoose.set("strictQuery", false);
        const mongoRef = await mongoose.connect(process.env.MONGO_URI);

        console.log("connected to db ", mongoRef.connection.host)


    } catch (error) {

        console.log(error)
        process.exit(1)

    }


}
module.exports = connectToDbFunc