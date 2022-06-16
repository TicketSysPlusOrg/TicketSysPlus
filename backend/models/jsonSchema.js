import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const jsonSchema = new Schema({
    body: {
        type: String,
        description: "body of JSON to be stored in DB"
    }
});
