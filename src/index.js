import { app } from "./app.js";
import connectDB from "./db/db.js";

const port = process.env.PORT || 8000

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on http://localhost:${port}`)
    })
})
.catch((error)=>{
    console.log(`MongoDB ERROR:`,error)
})
