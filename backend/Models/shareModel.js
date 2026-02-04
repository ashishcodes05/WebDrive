import { model, Schema } from "mongoose";

const shareSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    resourceId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    resourceType: {
        type: String,
        required: true,
        enum: ["file", "directory"]
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60
    }
},
{
    strict: "throw"
});

const Share = model("Share", shareSchema);

export default Share;