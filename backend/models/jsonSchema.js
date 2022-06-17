import mongoose from "mongoose";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * MongoDB schema for Jsons collection in MongoDB 
 * jsonSchema is used to store ticket templates via Json format
 * which are displayed in the Admin page 
 */

const Schema = mongoose.Schema;

export const jsonSchema = new Schema({
    body: {
        type: String,
        description: "body of JSON to be stored in DB"
    }
});
