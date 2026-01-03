import { model, Schema } from "mongoose";

const directorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentDir: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: "Directory"
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},
    {
        strict: 'throw'
    }
);

const Directory = model("Directory", directorySchema);

export default Directory;