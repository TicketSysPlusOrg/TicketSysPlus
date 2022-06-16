import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const settingsSchema = new Schema({
    body: {
        type: String,
        description: "body of Settings JSON to be stored in DB"
    }
});
