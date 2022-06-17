import mongoose from "mongoose";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * MongoDB schema for Settings collection in MongoDB 
 */

const Schema = mongoose.Schema;

export const settingsSchema = new Schema({
    body: {
        type: String,
        description: "body of Settings JSON to be stored in DB"
    }
});
