import { model, Schema } from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    name: {
        type: String,
        minLength: [3, "The name of the user should be atleast 3 characters long"],
        required: true,
        trim: true
    },
    email: {
        type: String,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please provide a valid email"
        ],
        unique: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        minLength: [8, "The password should be of 8 characters"],
        trim: true
    },
    hasPassword: {
        type: Boolean,
        default: false
    },
    rootDirectory: {
        type: Schema.Types.ObjectId,
        ref: "Directory",
        required: true
    },
    picture: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "user"
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
},
    {
        strict: "throw",
        methods: {
            comparePassword: async function(enteredPassword){
                return await bcrypt.compare(enteredPassword, this.password);
            }
        }
    }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.hasPassword = true;
  this.password = await bcrypt.hash(this.password, 12);
});

const User = model("User", userSchema);

export default User;