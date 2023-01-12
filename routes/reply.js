const replyController = require("../controllers/replyController")
const router = require("express").Router()


router.post("/", replyController.createReply)
router.get("/:postId/bypost", replyController.getReplyByPost)
router.put("/addMoreVBT", replyController.addMoreVBTToReply)
router.get("/:userId/byuser", replyController.getReplyByUserId)
router.delete("/:replyId", replyController.deleteReply)
module.exports = router;