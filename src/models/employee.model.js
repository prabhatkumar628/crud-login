import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const employeeSchema = new Schema({
    name:{
        type: String,
        required:[true, "Name is required"]
    },
    email:{
        type: String,
        required:[true, "Email is required"]
    },
    phone:{
        type: String,
        required:[true, "Phone is required"]
    },
    designation:{
        type: String,
        required:[true, "Designation is required"]
    },
    salary:{
        type: Number,
        required:[true, "Salary is required"]
    },
    city:{
        type: String,
    },
    state:{
        type: String,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps: true})

employeeSchema.plugin(mongooseAggregatePaginate)


export const Employee = mongoose.model("Employee", employeeSchema)