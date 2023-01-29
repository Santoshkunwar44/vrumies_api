const jwt = require("jsonwebtoken")

class TokenService {



    // jwt sign 
    async createToken(payload) {
        console.log(process.env.JWT_REF_SEC_KEY)
        try {
            const accessToken = jwt.sign(payload, process.env.JWT_SEC_KEY, {
                expiresIn: "36000000"
            })
            const refreshToken = jwt.sign(payload, process.env.JWT_REF_SEC_KEY, {
                expiresIn: "365d"
            })
            return { accessToken, refreshToken }
        } catch (error) {
            return error
        }
    }










    // store refresh token 
    async storeRefreshToken(token, userId) {

        try {
            await RefreshToken.create({ token, userId })
        } catch (err) {
            return err
        }

    }








    // verify refresh token 

    async verifyRefreshToken(refreshToken) {

        return await jwt.verify(refreshToken, process.env.JWT_REF_SEC_KEY)


    }








    // find refresh token document

    async findRefreshToken(userId, refreshToken) {


        const tokenDoc = await RefreshToken.findOne({ userId, token: refreshToken })

        return tokenDoc

    }






    // update refresh token 

    async updateRefreshToken(userId, refreshToken) {

        return await RefreshToken.findOneAndUpdate({ _id: userId },
            {
                token: refreshToken
            },
            {
                new: true
            }
        )

    }





    // verify token      

    async verifyToken(token) {
        const isVerified = jwt.verify(token, process.env.JWT_SEC_KEY)
        return isVerified
    }





    // remove refresh token 

    async removeRefToken(refreshToken) {
        await RefreshToken.deleteOne({ token: refreshToken })

    }

}
module.exports = new TokenService()