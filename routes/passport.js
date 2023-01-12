const router = require("express").Router()
const passport = require("passport")
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'https://luxury-pika-c9a6da.netlify.app/signup' }),
    function (req, res) {
        res.redirect('https://luxury-pika-c9a6da.netlify.app/');
    });

module.exports = router