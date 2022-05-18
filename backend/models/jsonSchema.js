import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const jsonSchema = new Schema({
    title: {
        type: String,
        minlength: 1,
        required: true
    },
    body: {
        type: String,
        description: "body of JSON to be stored in DB"
    }
});
