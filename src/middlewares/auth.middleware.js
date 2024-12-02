import jwt from "jsonwebtoken"
import { asynHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const verifyJWT = asynHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        console.log("Unauthorized required")
        return null
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)

        req.user = user
        next()
    } catch (error) {
        console.log(error.message || "Invalid access Token")
    }
})

export {verifyJWT}