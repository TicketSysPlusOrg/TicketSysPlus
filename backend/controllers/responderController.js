import mongoose from "mongoose";
import { responderSchema } from "../models/responderSchema.js";

const Responder = mongoose.model("Responder", responderSchema);


//POST
export const addResponder = (req, res) => {
    let newResponder = new Responder(req.body);

    newResponder.save((err, Responder) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Responder);
    });
};

//GET
export const getResponder = (req, res) => {
    Responder.find((err, Responder) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Responder);
    });
};


//PUT
export const changeResponder = (req, res) => {
    let bodyid = req.body;
    console.log(bodyid);

    Responder.findByIdAndUpdate(
        req.body,
        { blocked: true },
        { new: true },
        (err, Responder) => {
            if (err) {
                res.send(err);
            }
            res.json(Responder);
        }
    );
};

//DELETE
export const deleteResponder = (req, res) => {
    Responder.deleteOne(
        req.body,
        (err, Responder) => {
            if (err) {
                res.send(err);
            }
            res.json(Responder);
        }
    );
};