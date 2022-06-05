import mongoose from "mongoose";

import { settingsSchema } from "../models/settingsSchema";

const Settings = mongoose.model("Settings", settingsSchema);


//POST
export const addSettings = (req, res) => {
    let newSettings = new Settings(req.body);

    newSettings.save((err, Settings) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Settings);
    });
};

//GET
export const getSettings = (req, res) => {
    Settings.find((err, Settings) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Settings);
    });
};


//PUT
export const changeSettings = (req, res) => {
    let bodyid = req.body;
    console.log(bodyid);

    Settings.findByIdAndUpdate(
        req.body,
        { blocked: true },
        { new: true },
        (err, Settings) => {
            if (err) {
                res.send(err);
            }
            res.json(Json);
        }
    );
};

//DELETE
export const deleteSettings = (req, res) => {
    Settings.deleteOne(
        req.body,
        (err, Settings) => {
            if (err) {
                res.send(err);
            }
            res.json(Settings);
        }
    );
};
