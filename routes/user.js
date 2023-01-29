const userController = require("../controllers/userController")

const router = require("express").Router()

router.get("/loggedInUser", userController.loggedInUser)
router.get("/account/refresh", userController.refresh)
router.post("/login", userController.loginUser)
router.get("/all", userController.getUsers)
router.get("/:userId", userController.getUserById)
router.post("/", userController.addNewUser)
router.put("/:userId", userController.updateUser)
router.delete("/:userId", userController.deleteUser)
router.post("/logout", userController.logout)

module.exports = router