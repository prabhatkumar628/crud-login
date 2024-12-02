import mongoose from "mongoose";
import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";
import { asynHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
let user;

const home = asynHandler(async (req, res) => {
    let token;
    let data;

    if (req.cookies?.accessToken) {
        token = req.cookies?.accessToken
        let decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        user = await User.findById(decodedToken?._id)

        try {
            data = await Employee.aggregate([
                {
                    $match: {
                        owner: new mongoose.Types.ObjectId(user._id)
                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ])

        } catch (error) {
            console.log(error)
        }
    }

    if (!token) {
        return res.redirect("/users/login")
    }
    res.render("index", {
        user: {
            avatar: user.avatar
        }, data

    })
})

const addData = asynHandler(async (req, res) => {
    res.render("add", {
        user: {
            avatar: user.avatar
        }
    })
})

const postAddData = asynHandler(async (req, res) => {
    let errorMessage = {}
    const { name, email, phone, designation, salary, city, state } = req.body
    let data
    data = req.body
    try {
        await Employee.create({
            "name": name,
            "email": email,
            "phone": phone,
            "designation": designation,
            "salary": salary,
            "city": city,
            "state": state,
            "owner": req.user?._id || user._id
        })
        res.redirect("/")
    } catch (error) {
        error.errors?.name ? errorMessage["name"] = error.errors.name?.message : null
        error.errors?.email ? errorMessage["email"] = error.errors.email?.message : null
        error.errors?.phone ? errorMessage["phone"] = error.errors.phone?.message : null
        error.errors?.designation ? errorMessage["designation"] = error.errors.designation?.message : null
        error.errors?.salary ? errorMessage["salary"] = error.errors.salary?.message : null
        res.render("add", {
            data: data,
            errorMessage: errorMessage,
            user: {
                avatar: user.avatar
            }
        })
    }
})

const deleteData = asynHandler(async (req, res) => {
    try {
        await Employee.deleteOne({ _id: req.params })
        res.redirect("/")
    } catch (error) {
        console.log(error)
    }
})

const editData = asynHandler(async (req, res) => {
    let data
    try {
        data = await Employee.findById(req.params?._id)
        res.render("edit", {
            data: data,
            errorMessage: {},
            user: {
                avatar: user.avatar
            }
        })
    } catch (error) {
        console.log(error)
    }
})

const postEditData = asynHandler(async (req, res) => {
    let errorMessage = {}
    const { name, email, phone, designation, salary, city, state } = req.body
    let data
    let newdata
    data = req.body
    try {
        newdata = await Employee.findOne({ _id: req.params?._id })
        newdata.name = name
        newdata.email = email
        newdata.phone = phone
        newdata.designation = designation
        newdata.salary = salary
        newdata.city = city
        newdata.state = state
        await newdata.save({ ValidateBeforeSave: false })
        res.redirect("/")
    } catch (error) {
        error.errors?.name ? errorMessage["name"] = error.errors.name?.message : null
        error.errors?.email ? errorMessage["email"] = error.errors.email?.message : null
        error.errors?.phone ? errorMessage["phone"] = error.errors.phone?.message : null
        error.errors?.designation ? errorMessage["designation"] = error.errors.designation?.message : null
        error.errors?.salary ? errorMessage["salary"] = error.errors.salary?.message : null
        res.render("edit", {
            data: data,
            errorMessage: errorMessage,
            user: {
                avatar: user.avatar
            }
        })
    }
})

const searchData = asynHandler(async (req, res) => {
    const search = req.query.search?.trim()
    let data = []
    if (!search) {
        res.redirect("/")
    }
    try {
        const user = await User.findById(req.user?._id)
        if (!user) {
            res.redirect("/users/login")
        }

        data = await Employee.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(user?._id),
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                        { phone: { $regex: search, $options: "i" } },
                        { designation: { $regex: search, $options: "i" } },
                        { city: { $regex: search, $options: "i" } },
                        { state: { $regex: search, $options: "i" } },
                    ]
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ])

        res.render("index", {
            user: {
                avatar: user.avatar
            },
            data,
            searchQurey: {
                search
            }

        })







    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false
        })
    }

    // const user = await User.findById(req.user)

})


export { home, addData, postAddData, deleteData, editData, postEditData, searchData }