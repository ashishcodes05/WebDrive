import { model, Schema } from "mongoose";

const fileSchema = new Schema({
    name: {
        type: String,
        minLength: [1, "The filename should consist of atleast one character"],
        required: true
    },
    extension: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    parentDirectoryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Directory",
        index: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        index: true
    },
    isStarred: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null,
        expires: 30 * 24 * 60 * 60
    },
    isShared: {
        type: Boolean,
        default: false
    },
},
    {
        strict: 'throw'
    }
);

const File = model("File", fileSchema);
export default File;