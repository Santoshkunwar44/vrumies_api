const Transactions = require("../model/Transactions");
const User = require("../model/User")

class TransactionController {

    async addTransaction(req, res) {
        try {
            const savedTransaction = await Transactions.create(req.body)
            res.status(200).json({ message: savedTransaction, success: true })
        } catch (error) {
            res.status(500).json({ message: error.message, success: false })
        }
    }

    async getTransactionAsInpection(req, res) {
        const { inspectAs, userId } = req.query
        let queryObj = {}

        if (inspectAs === "seller") {
            queryObj.seller = userId
        } else if (inspectAs === "buyer") {
            {
                queryObj.buyer = userId
            }
        }
        try {
            const getTransactions = await Transactions.find(queryObj).populate("seller").populate("buyer")
            return res.status(200).json({ message: getTransactions, success: true })
        } catch (error) {
            return res.status(500).json({ message: error.message, success: false })
        }
    }


    async updateTransaction(req, res, next) {

        const { transactionId } = req.params;

        try {
            await Transactions.findByIdAndUpdate(transactionId, {
                $set: req.body
            }, {
                new: true
            })


            next()
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error.message, success: false })
        }
    }


    async addRatingsToUsers(req, res, next) {
        const { transactionId } = req.params;
        const currentTransaction = await Transactions.findById(transactionId)
        let updatedField = null
        for (let key in req.body) {
            updatedField = key
        }
        if (updatedField === "sellersFeedback") {
            const { sellersFeedback: { rating } } = req.body
            const { buyer, seller } = currentTransaction
            const buyerObj = await User.findById(buyer)
            const hasSellerRatedAlready = buyerObj.ratings.find((rating) => rating.userId.toString() === seller.toString());
            if (!hasSellerRatedAlready) {
                await User.findOneAndUpdate(
                    { _id: buyer },
                    { $push: { ratings: { userId: seller, rating } } },
                    { returnOriginal: false }
                )
            }
            else {
                await User.findOneAndUpdate(
                    { _id: buyer },
                    { $set: { "ratings.$[element].rating": rating } },
                    {
                        arrayFilters: [
                            { "element.userId": seller }
                        ],
                        returnOriginal: false
                    }
                )
            }

            next()
        } else {
            const { buyersFeedback: { rating } } = req.body
            const { buyer, seller } = currentTransaction
            const sellerObj = await User.findById(seller)
            const hasBuyerRatedAlready = sellerObj.ratings.find((rating) => rating.userId.toString() === buyer.toString());

            if (!hasBuyerRatedAlready) {
                await User.findOneAndUpdate(
                    { _id: seller },
                    { $push: { ratings: { userId: buyer, rating } } },
                    { returnOriginal: false }
                )
            }

            else {
                await User.findOneAndUpdate(
                    { _id: seller },
                    { $set: { "ratings.$[element].rating": rating } },
                    {
                        arrayFilters: [
                            { "element.userId": buyer }
                        ],
                        returnOriginal: false
                    }
                )
            }
            // raod to avg rating
            next()
        }
    }


    async settingTheAvgRating(req, res, next) {
        const { transactionId } = req.params;
        const currentTransaction = await Transactions.findById(transactionId).populate(['buyer', 'seller'])

        let updatedField = null
        let userRatingsArray = null
        let userId = null
        let avgRating = 0;
        for (let key in req.body) {
            updatedField = key
        }


        if (updatedField === "sellersFeedback") {
            userRatingsArray = currentTransaction.buyer.ratings;
            userId = currentTransaction.buyer._id
        } else {
            userRatingsArray = currentTransaction.seller.ratings;
            userId = currentTransaction.seller._id

        }


        if (userRatingsArray.length > 0) {
            avgRating = userRatingsArray.reduce((total, obj) => {
                return total + obj.rating;
            }, 0) / userRatingsArray.length
        }



        try {
            const updatedUser = await User.findByIdAndUpdate(userId.toString(), {
                avgRating
            }, {
                new: true
            })
            return res.status(200).json({ message: updatedUser, success: true })
        } catch (error) {
            return res.status(500).json({ message: error, success: false })
        }



    }

    async buyTokens(req, res) {
        const { userId, VBTcount } = req.body;
        console.log(req.body)

        try {
            const theUser = await User.findById(userId)
            await User.findByIdAndUpdate(userId, {
                tokenAvailabe: VBTcount + theUser.tokenAvailabe
            })
            return res.status(200).json({ message: "VBTbought successfully", success: true })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: "Something went wrong", success: false })
        }
    }

    async createTransactionDispute(req, res) {
        const { transactionId, userId, comment, userType, nextUser } = req.body

        try {


            await Transactions.findById(transactionId)
            // const theReportedDisputeBy = theTransaction.disputes?.reportedDisputeBy?.toString()



            const updatedTransaction = await Transactions.findByIdAndUpdate(transactionId, {
                $push: { disputes: { reportedDisputeBy: userId, gotDispute: nextUser, comment } }
            }, {
                new: true
            })


            await User.updateOne(
                { _id: nextUser },
                { $inc: { disputes: 1 } }
            );
            return res.status(200).json({ message: updatedTransaction, success: true })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ message: error, success: false })
        }
    }


    async myOrderPost(req, res) {
        const { userId } = req.params;

        try {
            const myOrderPost = await Transactions.find({ buyer: userId }, { post: 1 })
            res.status(200).json({ message: myOrderPost, success: true })
        } catch (error) {

            res.status(500).json({ message: myOrderPost, success: true })
        }

    }






}
module.exports = new TransactionController()