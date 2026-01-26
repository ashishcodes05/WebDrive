import { model, Schema } from "mongoose";

const directorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    parentDirectoryId: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: "Directory"
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    isStarred: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null,
        expires: 30 * 24 * 60 * 60
    }
},
    {
        strict: 'throw'
    }
);

const Directory = model("Directory", directorySchema);

export default Directory;