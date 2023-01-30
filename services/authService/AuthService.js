const bcrypt = require("bcrypt")
const UserModal = require("../../model/User")

class AuthService {

    async createGoogleUser(user, req) {
        if (user) {
            const { email } = user
            try {
                const User = await UserModal.findOne({ email })
                if (User) {
                    console.log(User._id)
                    await UserModal.findByIdAndUpdate(User._id, {
                        $set: {
                            lastLoggedIn: Date.now()
                        }
                    })
                    const { password, ...others } = User._doc
                    req.session.user = {
                        ...others,
                    }
                    return req.session.user
                } else {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(user.username, salt)
                    user.password = hashedPassword
                    user.lastLoggedIn = Date.now()
                    const User = await UserModal.create(user)
                    const { password, ...others } = User._doc
                    req.session.user = {
                        ...others,
                    }
                    return req.session.user
                }
            } catch (error) {
                console.log(error)
            }
        }

    }

    async isUserUpdated(prevUser) {
        try {
            const user = await UserModal.findById(prevUser._id)
            const { updatedAt: newUserUpdatedTime } = user._doc;
            const { updatedAt: prevUserUpdatedTime } = prevUser
            let newUpdatedTimeInMS = new Date(newUserUpdatedTime).getTime()
            let prevUpdatedTimeInMS = new Date(prevUserUpdatedTime).getTime()
            if (newUpdatedTimeInMS > prevUpdatedTimeInMS) {
                const { password, ...others } = user._doc
                return others
            } else {
                return prevUser
            }
        } catch (error) {
            console.log(error)
            return error
        }
    }


    async timeForPassportSessionToExpire(user) {

        const { lastLoggedIn } = user;


        let currentTimeInMs = Date.now();

        let remainingTimeInMs = currentTimeInMs - lastLoggedIn;












    }





}

module.exports = new AuthService()


