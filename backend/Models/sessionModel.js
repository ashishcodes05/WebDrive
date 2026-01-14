import { model, Schema } from "mongoose";

const sessionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 7 * 24 * 60 * 60 //7 day
    }
}, { strict: "throw"});

const Session = model("Session", sessionSchema);

export default Session;