const replyController = require("../controllers/replyController")
const { tokenVerification } = require("../middlewares/authMiddleware")
const router = require("express").Router()


router.get("/:postId/bypost", replyController.getReplyByPost)
router.get("/:userId/byuser", replyController.getReplyByUserId)
router.post("/", tokenVerification, replyController.createReply)
router.put("/addMoreVBT", tokenVerification, replyController.addMoreVBTToReply)
router.delete("/:replyId", tokenVerification, replyController.deleteReply)
module.exports = router;