import { model, Schema } from "mongoose"

const userSchema = new Schema({
    name: {
        type: String,
        minLength: [3, "The name of the user should be atleast 3 characters long"],
        required: true
    },
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please provide a valid email"
        ],
        required: true
    },
    password: {
        type: String,
        minLength: [8, "The password should be of 8 characters"],
        required: true
    },
    rootDirectory: {
        type: Schema.Types.ObjectId,
        ref: "Directory",
        required: true
    }
},
    {
        strict: "throw"
    }
);

const User = model("User", userSchema);

export default User;