const postController = require("../controllers/postController")

const router = require("express").Router()


router.get("/location", postController.getPostByLocation)
router.get("/:catName", postController.getPostByCategory)
router.delete("/:postId", postController.hidePost)
router.get("/", postController.getAllPost)
router.get("/:id/byId", postController.getPostById)
router.post("/", postController.addNewPost)
router.put("/:postId", postController.updatePost)
router.get("/:userId/byUserId", postController.getPostByUserId)

module.exports = router