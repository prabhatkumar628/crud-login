import { Router } from "express";
import {  addData, deleteData, editData, home, postAddData, postEditData, searchData } from "../controllers/data.controller.js";
import userRouter from "./user.router.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const  router = Router()

router.route("").get(home)
router.route("/users", userRouter )
router.route("/add-data").get(verifyJWT, addData)
router.route("/add-data").post(verifyJWT, postAddData)
router.route("/delete/:_id").get(verifyJWT,deleteData)
router.route("/edit/:_id").get(verifyJWT,editData)
router.route("/edit/:_id").post(verifyJWT,postEditData)
router.route("/search").get(verifyJWT,searchData)



export default router