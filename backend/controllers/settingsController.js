import mongoose from "mongoose";

import { settingsSchema } from "../models/settingsSchema";

const Settings = mongoose.model("Settings", settingsSchema);


//POST
export const addSettings = (req, res) => {
    let newSettings = new Settings(req.body);

    newSettings.save()
        .then(settings => res.json(settings))
        .catch(err => res.send(err));
};

//GET
export const getSettings = (req, res) => {
    Settings.find().exec()
        .then(settings => res.json(settings))
        .catch(err => res.send(err));
};


//PUT
export const changeSettings = (req, res) => {
    if (req.body._id !== undefined) {
        const { _id, body } = req.body;
        Settings.findByIdAndUpdate(
            _id,
            { body: body }
        ).exec()
            .then(settings => res.json(settings))
            .catch(err => res.send(err));
    }
};

//DELETE
export const deleteSettings = (req, res) => {
    Settings.deleteOne(
        req.body
    ).exec()
        .then(json => res.json(json))
        .catch(err => res.send(err));
};
