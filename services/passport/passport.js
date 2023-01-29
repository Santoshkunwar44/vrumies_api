var GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
const User = require('../../model/User');
const { createGoogleUser } = require('../authService/AuthService');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        const googleUser = {
            username: profile.displayName,
            email: profile._json.email,
            profileImg: profile._json.picture,
        };


        try {
            const theGoogleUser = await createGoogleUser(googleUser, request)
            done(null, theGoogleUser)
        } catch (error) {
            console.log(error)
        }
    }
));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});