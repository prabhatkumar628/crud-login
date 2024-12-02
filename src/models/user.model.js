import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
        unique: true,
        required: [true, "Username is required"]
    },
    fullName: {
        type: String,
        trim: true,
        index: true,
        required: [true, "Full Name is required"]

    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, "Email is required"]

    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"]

    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "Phone is required"]

    },
    avatar: {
        type: String,
        required: [true, "Username is required"]

    },
    refreshToken:{
        type: String
    }

}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        fullName: this.fullName,
        username: this.username,
        email: this.email
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)


