const router = require("express").Router()
const PaymentController = require("../controllers/payment")
const { tokenVerification } = require("../middlewares/authMiddleware")
router.get("/config", tokenVerification, PaymentController.getPusblishableKey)
router.post("/create-payment-intent", tokenVerification, PaymentController.createPaymentIntent)



module.exports = router      
