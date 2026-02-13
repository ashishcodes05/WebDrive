import { model, Schema } from "mongoose";

const permissionSchema = new Schema({
    resourceId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    resourceType: {
        type: String,
        enum: ["file", "directory"],
        required: true,
        index: true
    },
    isRoot: {
        type: Boolean,
        default: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    role: {
        type: String,
        enum: ["owner", "viewer", "editor"],
        required: true
    }
},
{
    strict: "throw"
}
);

const Permission = model("Permission", permissionSchema);

export default Permission;