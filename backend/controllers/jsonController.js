import mongoose from "mongoose";
import {TicketSchema} from "../models/BaseSchemaJS.js";

const Json = mongoose.model("Json", TicketSchema);

//functions that interact w/ db when sending request to api. request to api w/ route, controller executes func in db

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
    let bodyid = req.body;
    console.log(bodyid);

    Json.findByIdAndUpdate(
        req.body,
        { blocked : true},
        { new: true },
        (err, Json) => {
            if (err) {
                res.send(err);
            }
            res.json(Json);
        }
    );
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
