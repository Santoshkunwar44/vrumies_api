const User = require("../model/User");
const { isUserUpdated } = require("../services/authService/AuthService");

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



        if (passportSessionUser) {
            let updatedUser = await isUserUpdated(passportSessionUser)
            return res.status(200).json({ message: updatedUser, success: true })
        } else {
            return res.status(500).json({ message: "User has not Logged IN", success: true })
        }
    }



    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send(err);
            } else {
                // Remove the session user from the MongoDB
                // Or perform any other actions that should be done to log the user out
                res.send('User logged out');
            }
        });


    }
}
module.exports = new UserController()

