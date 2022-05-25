import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const responderSchema = new Schema({
    email: {
        type: String,
        minlength: 1,
        required: true
    }
});
