import mongoose from "mongoose";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * MongoDB schema for Settings collection in MongoDB 
 * memberSchema is used to give users Admin privilege to the site and
 * update the ticket responders list on the Admin page
 */

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
