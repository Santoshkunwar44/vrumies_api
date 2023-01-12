const transactionController = require("../controllers/transactionController")

const router = require("express").Router()

router.post("/", transactionController.addTransaction)
router.get("/inspect", transactionController.getTransactionAsInpection)
router.get("/myorderpost/:userId", transactionController.myOrderPost)
router.put("/:transactionId", transactionController.updateTransaction, transactionController.addRatingsToUsers, transactionController.settingTheAvgRating)
router.post("/buytokens", transactionController.buyTokens)
router.post("/disputes", transactionController.createTransactionDispute)
module.exports = router  