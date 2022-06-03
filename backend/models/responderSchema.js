import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const responderSchema = new Schema({
    image: {
        type: String,
        minlength: 1,
        required: true
    },
    name: {
        type: String,
        minlength: 1,
        required: true
    },
    email: {
        type: String,
        minlength: 1,
        required: true
    }
});
