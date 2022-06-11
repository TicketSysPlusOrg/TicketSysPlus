import mongoose from "mongoose";

import { memberSchema } from "../models/memberSchema.js";

const Responder = mongoose.model("Responder", memberSchema);

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
    if (req.body.id !== undefined) {
        const { id, ...filter } = req.body;
        Responder.findByIdAndDelete(
            id,
            filter,
            (err, Responder) => {
                if (err) {
                    res.send(err);
                }
                res.json(Responder);
            }
        );
    } else {
        Responder.deleteOne(
            req.body,
            (err, Responder) => {
                if (err) {
                    res.send(err);
                }
                res.json(Responder);
            }
        );
    }
};
