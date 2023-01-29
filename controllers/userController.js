const User = require("../model/User");

const { isUserUpdated, createToken } = require("../services/authService/AuthService");

const AuthService = require("../services/authService/AuthService");
const TokenService = require("../services/authService/TokenService");


class UserController {

    async addNewUser(req, res) {
        try {
            const savedUser = await User.create(req.body)
            res.status(200).json({ message: savedUser, success: true })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error, success: false })
        }
    }

    async getUsers(req, res) {
        try {
            const theUsers = await User.find({})
            res.status(200).json({ message: theUsers, success: true })

        } catch (error) {

            console.log(error)
            res.status(500).json({ message: error, success: false })

        }
    }

    async getUserById(req, res) {

        const { userId } = req.params



        try {
            const theUsers = await User.findById(userId)
            res.status(200).json({ message: theUsers, success: true })

        } catch (error) {

            console.log(error)
            res.status(500).json({ message: error, success: false })

        }
    }


    async updateUser(req, res) {
        const { userId } = req.params;
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, {
                $set: req.body
            }, {
                new: true,
            })
            res.status(200).json({ message: updatedUser, success: true })
        } catch (error) {
            res.status(500).json({ message: error, success: false })
        }
    }

    async deleteUser(req, res) {
        const { userId } = req.params;
        try {
            await User.findByIdAndDelete(userId)
            res.status(200).json({ message: "User deleted successfully", success: true })
        } catch (error) {
            res.status(500).json({ message: error, success: false })
        }
    }




    async loggedInUser(req, res) {
        const passportSessionUser = req.session?.passport?.user


        try {
            if (passportSessionUser) {

                let updatedUser = await isUserUpdated(passportSessionUser)
                return res.status(200).json({ message: updatedUser, success: true })
            } else {
                throw new Error("User not logged in")
            }
        } catch (error) {
            return res.status(401).json({ message: "User has not Logged IN", success: false })

        }

    }

    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                // Remove the session user from the MongoDB
                // Or perform any other actions that should be done to log the user out
                const { refreshToken } = req.cookies
                TokenService.removeRefToken(refreshToken)
                res.clearCookie("refreshToken")
                res.clearCookie("accessToken")
                res.clearCookie("vrumies.sid")
                res.status(200).json('User logged out');
            }
        });


    }
    // login 

    async loginUser(req, res) {
        try {
            const userToken = await AuthService.createToken(req.body)
            res.status(200).json({ token: userToken })
        } catch (error) {
            console.log("-------------the eror")
        }
    }


    // account refreshh 
    async refresh(req, res) {
        // get req token from cookie 

        const { refreshToken: refreshTokenFromCookie } = req.cookies

        console.log("the refresh token ", refreshTokenFromCookie)

        let userData;
        // check if token is valid 

        try {
            userData = await TokenService.verifyRefreshToken(refreshTokenFromCookie)
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: "Invalid token 1" })


        }




        //  check if the refresh token is in db

        try {
            await TokenService.findRefreshToken(userData._id, refreshTokenFromCookie)


        } catch (error) {
            console.log(error)

            return res.status(500).json({ message: "Internal Error " })
        }




        // check if user is valid 

        const user = await User.findById({ _id: userData._id })

        if (!user) {
            return res.status(401).json({ message: "No user", success: false })
        }



        // generate new tokens


        const { refreshToken, accessToken } = await TokenService.createToken({ _id: userData._id })


        console.log("the userData id ", userData)

        // update refresh token 
        try {

            await TokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: "server error", success: false })
        }



        // put into the cookie
        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
            httpOnly: true,
        })
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
        })

        return res.json({ message: { accessToken, user: user }, success: true })
    }

}
module.exports = new UserController()

