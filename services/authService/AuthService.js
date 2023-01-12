const bcrypt = require("bcrypt")
const UserModal = require("../../model/User")

class AuthService {

    async createGoogleUser(user, req) {
        if (user) {
            const { email } = user
            try {
                const User = await UserModal.findOne({ email })
                if (User) {
                    const { password, ...others } = User._doc
                    req.session.user = {
                        ...others
                    }
                    return User
                } else {
                    const salt = await bcrypt.genSalt(10)
                    const hashedPassword = await bcrypt.hash(user.username, salt)
                    user.password = hashedPassword
                    const User = await UserModal.create(user)
                    const { password, ...others } = User._doc
                    req.session.user = {
                        ...others
                    }
                    return User
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
            // console.log(newUserUpdatedTime)
            console.log(prevUser, user._doc)
            if (newUpdatedTimeInMS > prevUpdatedTimeInMS) {
                return user._doc
            } else {
                return user._doc //   ||  prevUser 
            }
        } catch (error) {
            console.log(error)
            return error
        }

    }

}

module.exports = new AuthService()


