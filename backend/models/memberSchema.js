import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const memberSchema = new Schema({
    image: {
        type: String,
        minlength: 1,
        required: false
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
