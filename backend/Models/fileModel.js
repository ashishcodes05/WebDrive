import { model, Schema } from "mongoose";

const fileSchema = new Schema({
    filename: {
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
    parDirId: {
        type: Schema.Types.ObjectId,
        required: true,
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

const File = model("File", fileSchema);
export default File;