const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class PaymentContoller {
    getPusblishableKey(req, res) {
        res.json({ message: process.env.STRIPE_PUBLISHABLE_KEY, success: true })
    }

    async createPaymentIntent(req, res) {

        const { email, userId, description, amount } = req.body;
        console.log(req.body)

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "usd",
                amount: amount * 100,
                description,
                metadata: {
                    userId,
                    email
                },
                automatic_payment_methods: {
                    enabled: true
                },
            })
            console.log(paymentIntent)
            res.status(200).json({ message: paymentIntent.client_secret, success: true })

        } catch (error) {
            console.log(error)
            res.status(500).json({ error, success: true })
        }

    }


}


module.exports = new PaymentContoller()