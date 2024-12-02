import { Router } from "express";
import {  loginUser, logoutUser, postLoginUser, postRegister, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router()

userRouter.route("/register").get(register)
userRouter.route("/register").post(upload.single("avatar"),postRegister)
userRouter.route("/login").get(loginUser)
userRouter.route("/login").post(postLoginUser)
userRouter.route("/logout").get(verifyJWT,logoutUser)


export default userRouter
