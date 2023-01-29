const postController = require("../controllers/postController")
const { tokenVerification } = require("../middlewares/authMiddleware")

const router = require("express").Router()


router.get("/location", postController.getPostByLocation)
router.get("/:catName", postController.getPostByCategory)
router.get("/", postController.getAllPost)
router.get("/:id/byId", postController.getPostById)
router.delete("/:postId", tokenVerification, postController.hidePost)
router.post("/", tokenVerification, postController.addNewPost)
router.put("/:postId", tokenVerification, postController.updatePost)
router.get("/:userId/byUserId", postController.getPostByUserId)
router.post("/addMoreVBT/:id", tokenVerification, postController.addMoreVBTtoPost)
module.exports = router