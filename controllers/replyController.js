const Reply = require("../model/Reply")
const User = require("../model/User")

class ReplyController {

    async createReply(req, res) {
        const { vbtUsed, user } = req.body
        if (!vbtUsed || vbtUsed < 4 || !user) {
            return res.status(500).json({ message: "invalid data ", success: false })
        }
        try {
            let savedReply = await Reply.create(req.body)
            savedReply = await savedReply.populate("user")
            await User.findByIdAndUpdate(user,
                { $inc: { tokenAvailabe: -vbtUsed } }
            )

            res.status(200).json({ message: savedReply, success: true })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error, success: false })

        }
    }


    async getReplyByPost(req, res) {

        const { postId } = req.params;

        try {
            const reply = await Reply.find({ post: postId }).sort({ vbtUsed: -1 }).populate("user")
            res.status(200).json({ message: reply, success: true })
        } catch (error) {
            res.status(500).json({ message: error, success: false })
        }

    }
    async getReplyByUserId(req, res) {
        const { userId } = req.params;
        try {
            const theReplyQuotes = await Reply.find({
                user: userId
            }).populate("user")
            res.status(200).json({ message: theReplyQuotes })
        } catch (error) {
            res.status(500).json({ message: error, success: false })
        }
    }


    async deleteReply(req, res) {
        const replyId = req.params.replyId
        try {
            await Reply.findByIdAndDelete(replyId)
        } catch (error) {
            res.json({ message: error, success: false })
        }
    }

    async addMoreVBTToReply(req, res) {

        const { vbtUsed, replyId, userId } = req.body

        if (!vbtUsed || !replyId || !userId) {
            return res.status(403).json({ message: "Invalid credentails" })
        }

        try {
            const updatedReply = await Reply.findByIdAndUpdate(replyId,
                {
                    $inc: { vbtUsed: vbtUsed }
                },
                {
                    new: true
                })
            await User.findByIdAndUpdate(userId, {
                $inc: { tokenAvailabe: -vbtUsed }
            })
            return res.json({ message: updatedReply, success: true })
        } catch (error) {

            return res.json({ message: error, success: true })

        }

    }

}
module.exports = new ReplyController()

