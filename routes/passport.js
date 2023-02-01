const router = require("express").Router()
const passport = require("passport");
const TokenService = require("../services/authService/TokenService");
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/signup` }),
    async function (req, res) {
        const { ...others } = req.session.passport.user;
        const { accessToken, refreshToken } = await TokenService.createToken({
            _id: others._id
        })
        TokenService.storeRefreshToken(refreshToken, others._id)
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
            secure: true,
            httpOnly: true,
            sameSite: "None"
        })
        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 2,
            secure: true,
            httpOnly: true,
            sameSite: "None"
        })
        res.redirect(`${process.env.FRONTEND_URL}/`);
    });

module.exports = router