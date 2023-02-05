const Post = require("../model/Post")
const User = require("../model/User")

class PostController {



    async addNewPost(req, res) {

        const { owner, VBTused } = req.body
        if (!owner) {
            return res.status(403).json({ message: "Incomplete credentails", success: false })
        }

        try {
            await User.findByIdAndUpdate(owner, {
                $inc: { tokenAvailabe: -VBTused }
            })
            const savedPost = await Post.create(req.body)
            res.status(200).json({ message: savedPost, success: true })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error, success: false })

        }





    }

    async getAllPost(req, res) {

        try {
            // const allPosts = await Post.find({ isHidden: false })
            const allPosts = await Post.aggregate([
                {
                    $match: { isHidden: false }
                },
                {
                    $sort: {
                        VBTused: -1, orderNowBtn: 1
                    }
                }
            ])
            res.json({
                message: allPosts,
                success: true
            })
        } catch (error) {
            res.json({ message: error, success: false })
        }

    }
    async getPostByCategory(req, res) {
        let { catName } = req.params

        if (catName.includes("&&")) {
            catName = catName.replaceAll("&&", "/")
        }
        try {
            const thePosts = await Post.find({ category: catName, isHidden: false }).sort({ VBTused: -1, orderNowBtn: 1 }).populate("owner")

            return res.status(200).json({ message: thePosts, success: true })

        } catch (error) {
            return res.status(500).json({ message: error, success: false })
        }

    }

    async getPostById(req, res) {

        const { id } = req.params;
        if (!id) return
        try {
            const thePosts = await Post.findById(id).populate("owner")
            return res.status(200).json({ message: thePosts, success: true })
        } catch (error) {
            return res.status(500).json({ message: error, success: false })
        }
    }
    async addMoreVBTtoPost(req, res) {
        const { id } = req.params;
        const { vbt, userId } = req.body
        try {
            if (!id || !vbt) {
                throw new Error("Invalid credentails ");
            }
            const updatedPost = await Post.findByIdAndUpdate(id,
                {
                    $inc: { VBTused: vbt }
                },
                {
                    new: true
                }).populate("owner")
            await User.findByIdAndUpdate(userId, {
                $inc: { tokenAvailabe: -vbt }
            })
            res.status(200).json({ message: updatedPost, success: true })
        } catch (error) {
            console.log(error)
            res.status(403).json({ message: error, success: false })
        }
    }
    async updatePost(req, res) {

        const { postId } = req.params;


        if (!postId) return
        try {
            const savedPost = await Post.findByIdAndUpdate(postId, {
                $set: req.body
            }, {
                new: true
            }).populate("owner")



            return res.status(200).json({ message: savedPost, success: true })
        } catch (error) {
            return res.status(500).json({ message: error, success: false })
        }
    }

    async getPostByUserId(req, res) {
        const { userId } = req.params;
        try {
            const postRequest = await Post.find({
                owner: userId,
                isHidden: false,
                type: "Request"
            }).populate("owner")
            const postAdvertise = await Post.find({
                isHidden: false,
                owner: userId,
                type: "Advertise"
            }).populate("owner")
            return res.status(200).json({ message: { postRequest, postAdvertise }, success: true })

        } catch (error) {

            return res.status(500).json({ message: error, success: false })

        }


    }

    async hidePost(req, res) {

        const { postId } = req.params

        try {
            await Post.findByIdAndUpdate(postId, {
                isHidden: true
            })
            return res.json({ message: "Post hidden successfully", success: true })
        } catch (error) {
            return res.json({ message: error, success: false })

        }

    }

    async getPostByLocation(req, res) {

        let { city = "", state = "", category } = req.query


        if (category.includes("&&")) {
            category = category.replaceAll("&&", "/")
        }
        try {

            const thePost = await Post.find({
                category,
                isHidden: false,
                $or: [
                    {
                        "location.state": state
                    },
                    {
                        "location.city": city
                    },
                ]
            }).populate("owner")
            res.status(200).json({ message: thePost, success: true })
        } catch (error) {
            res.status(500).json({ message: error, success: false })
        }

    }
}
module.exports = new PostController()

