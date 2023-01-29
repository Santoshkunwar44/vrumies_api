const transactionController = require("../controllers/transactionController")
const { tokenVerification } = require("../middlewares/authMiddleware")

const router = require("express").Router()
router.get("/myorderpost/:userId", transactionController.myOrderPost)
router.post("/", tokenVerification, transactionController.addTransaction)
router.get("/inspect", tokenVerification, transactionController.getTransactionAsInpection)
router.put("/:transactionId", tokenVerification, transactionController.updateTransaction, transactionController.addRatingsToUsers, transactionController.settingTheAvgRating)
router.post("/buytokens", tokenVerification, transactionController.buyTokens)
router.post("/disputes", tokenVerification, transactionController.createTransactionDispute)
module.exports = router  