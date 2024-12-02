import express from "express"
import hbs from "hbs"
import cookieParser from "cookie-parser"

const app= express()

app.set("view engine", "hbs")
app.use(express.static("./views/public"))
hbs.registerPartials("views/partial")
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(cookieParser())


//routes start
import dataRouter from "./routes/data.router.js"
import userRouter from "./routes/user.router.js"


app.use("",dataRouter )
app.use("/users",  userRouter)

export {app,}
