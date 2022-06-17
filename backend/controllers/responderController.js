import mongoose from "mongoose";

import { memberSchema } from "../models/memberSchema.js";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Backend Controller for Responder collection in MongoDB
 * the Responder collection stores objects containing first and last names, email addresses,
 * and AzureDB avatar image links
 */

const Responder = mongoose.model("Responder", memberSchema);

//POST
export const addResponder = (req, res) => {
    let newResponder = new Responder(req.body);

    newResponder.save()
        .then(responder => res.json(responder))
        .catch(err => res.send(err));
};

//GET
export const getResponder = (req, res) => {
    Responder.find().exec()
        .then(responder => res.json(responder))
        .catch(err => res.send(err));
};


//PUT
export const changeResponder = (req, res) => {
    if (req.body._id !== undefined) {
        const { _id, body } = req.body;
        Responder.findByIdAndUpdate(
            _id,
            { body: body }
        ).exec()
            .then(responder => res.json(responder))
            .catch(err => res.send(err));
    }
};

//DELETE
export const deleteResponder = (req, res) => {
    if (req.body.id !== undefined) {
        const { id, ...filter } = req.body;
        Responder.findByIdAndDelete(
            id,
            filter
        ).exec()
            .then(responder => res.json(responder))
            .catch(err => res.send(err));
    } else {
        Responder.deleteOne(
            req.body
        ).exec()
            .then(responder => res.json(responder))
            .catch(err => res.send(err));
    }
};
