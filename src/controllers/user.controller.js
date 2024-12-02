import { User } from "../models/user.model.js";
import { asynHandler } from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
}

const register = asynHandler(async (req, res) => {
    res.render("register")
})

const postRegister = asynHandler(async (req, res) => {
    const errorMessage = {}
    const { username, fullName, email, phone, password, confirmPassword } = req.body
    const data = req.body
    let avatar;
    try {
        const existedUser = await User.findOne({
            $or: [{ username }, { email }, { phone }]
        })

        if (existedUser) {
            errorMessage["user"] = "User already existed"
            return res.render("register", {
                errorMessage: errorMessage,
                data: data
            })
        }

        let avatarLocalPath = req.file?.path
        if (!avatarLocalPath) {
            errorMessage["avatar"] = "Avatar is Required"
        }

        avatar = await uploadOnCloudinary(avatarLocalPath)
        if (!avatar) {
            errorMessage["avatar"] = "Problem with upload image"
        }

        if (password !== confirmPassword) {
            errorMessage["confirmPassword"] = "password does not match"
        }
        if (confirmPassword === "") {
            errorMessage["confirmPassword"] = "Confirm Password is required"
        }
        const user = await User.create({
            "fullName": fullName,
            "username": username,
            "email": email,
            "phone": phone,
            "password": password,
            "avatar": avatar?.url || ""
        })

        if (!user) {
            errorMessage["registerError"] = "Somethin want wrong while register new user"
        }
        res.redirect("/users/login")
    } catch (error) {
        try {
            const response = await deleteOnCloudinary(avatar.url)
        } catch (error) {
            console.log(error)
        }
        error.errors?.username ? errorMessage["username"] = error.errors.username.message : null
        error.errors?.fullName ? errorMessage["fullName"] = error.errors.fullName.message : null
        error.errors?.email ? errorMessage["email"] = error.errors.email.message : null
        error.errors?.phone ? errorMessage["phone"] = error.errors.phone.message : null
        error.errors?.password ? errorMessage["password"] = error.errors.password.message : null
        res.render("register", {
            errorMessage: errorMessage,
            data: data
        })
    }
})

const loginUser = asynHandler(async (req, res) => {
    res.render("login")
})

const postLoginUser = asynHandler(async (req, res) => {
    const errorMessage = {}
    let data;
    data = req.body
    const { usernameOrEmail, password } = req.body
    if (!usernameOrEmail) {
        errorMessage["usernameOrEmail"] = "Please enter username or Email"
        return res.render("login", {
            data: data,
            errorMessage: errorMessage
        })

    }
    if (!password) {
        errorMessage["password"] = "Please enter Passwrod"
        return res.render("login", {
            data: data,
            errorMessage: errorMessage
        })

    }
    try {
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        })
        if (!user) {
            errorMessage["InvalidUser"] = "User does not exists"
        }
        
        const isPasswordValid = await user.isPasswordCorrect(password)
        if (!isPasswordValid) {
            errorMessage["password"] = "Please enter valid password"
            return res.render("login", {
                data: data,
                errorMessage: errorMessage
            })
        }

        if (!isPasswordValid) {
            errorMessage["password"] = "Enter a valid Password"
            return res.render("login", {
                data: data,
                errorMessage: errorMessage
            })

        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id)
        return res
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect("/")
    } catch (error) {
        res.render("login", {
            data: data,
            errorMessage: errorMessage
        })
    }
})

const logoutUser = asynHandler(async (req, res) => {
   const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        }, { new: true }
    )
    return res
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .render("logout", {
            data:{
                fullName:user?.fullName
            }
        })
})


export { register, loginUser, postLoginUser, postRegister, logoutUser }