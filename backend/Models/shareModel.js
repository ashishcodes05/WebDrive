import { model, Schema } from "mongoose";

const shareSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    fileId: {
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