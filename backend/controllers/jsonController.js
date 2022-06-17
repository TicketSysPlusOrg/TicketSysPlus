import mongoose from "mongoose";

import { jsonSchema } from "../models/jsonSchema";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Backend Controller for Json collection in MongoDB
 * the Json collection stores ticket information that is displayed in the 
 * Admin page and used for the conditional logic when creating tickets
 */

const Json = mongoose.model("Json", jsonSchema);


//POST
export const addJson = (req, res) => {
    let newJson = new Json(req.body);

    newJson.save()
        .then(json => res.json(json))
        .catch(err => res.send(err));
};

//GET
export const getJson = (req, res) => {
    Json.find().exec()
        .then(json => res.json(json))
        .catch(err => res.send(err));
};


//PUT
export const changeJson = (req, res) => {
    if (req.body._id !== undefined) {
        const { _id, body } = req.body;
        Json.findByIdAndUpdate(
            _id,
            { body: body }
        ).exec()
            .then(json => res.json(json))
            .catch(err => res.send(err));
    }
};

//DELETE
export const deleteJson = (req, res) => {
    Json.deleteOne(
        req.body
    ).exec()
        .then(json => res.json(json))
        .catch(err => res.send(err));
};
