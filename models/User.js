import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,       
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            require: true,
        },
        role: {
            type: String, 
            enum: ["user", "admin", "student"],
            default: "visitor",
        }
    },
    {
        timestamps: true,
    }
)

export default mongoose.model("User", userSchema);