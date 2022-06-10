import mongoose from "mongoose";

import { jsonSchema } from "../models/jsonSchema";

const Json = mongoose.model("Json", jsonSchema);


//POST
export const addJson = (req, res) => {
    let newJson = new Json(req.body);

    newJson.save((err, Json) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Json);
    });
};

//GET
export const getJson = (req, res) => {
    Json.find((err, Json) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Json);
    });
};


//PUT
export const changeJson = (req, res) => {
    if (req.body._id !== undefined) {
        const { _id, body } = req.body;
        Json.findByIdAndUpdate(
            _id,
            {body: body},
            (err, Json) => {
                if (err) {
                    res.send(err);
                }
                res.json(Json);
            }
        );
    }
};

//DELETE
export const deleteJson = (req, res) => {
    Json.deleteOne(
        req.body,
        (err, Json) => {
            if (err) {
                res.send(err);
            }
            res.json(Json);
        }
    );
};
