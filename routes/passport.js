const router = require("express").Router()
const passport = require("passport");
const TokenService = require("../services/authService/TokenService");
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000/authenticate' }),
    async function (req, res) {
        const { ...others } = req.session.passport.user;
        const { accessToken, refreshToken } = await TokenService.createToken({
            _id: others._id
        })
        TokenService.storeRefreshToken(refreshToken, others._id)
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
            httpOnly: true,
            secure: true,
        })
        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
            httpOnly: true,
            secure: true,
        })
        res.redirect('http://localhost:3000/');
    });

module.exports = router