import mongoose from "mongoose";
import { PlayerSchema } from "../models/playerModel.js";

const Player = mongoose.model("Player", PlayerSchema);

//functions that interact w/ db when sending request to api. request to api w/ route, controller executes func in db

//POST
export const addNewPlayer = (req, res) => {
    let newPlayer = new Player(req.body);

    newPlayer.save((err, Player) => {
    //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Player);
    });
};

export const getPlayers = (req, res) => {
    Player.find((err, Player) => {
    //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Player);
    });
};

export const getPlayerWithID = (req, res) => {
    Player.findById(req.params.PlayerId, (err, Player) => {
        if (err) {
            res.send(err);
        }
        res.json(Player);
    });
};

export const updatePlayer = (req, res) => {
    //first find who to update, then pass the info we need to update, make sure we get NEW player copy to return, then pass to db
    Player.findOneAndUpdate(
        { _id: req.params.PlayerId },
        req.body,
        { new: true },
        (err, Player) => {
            if (err) {
                res.send(err);
            }
            res.json(Player);
        }
    );
};

export const deletePlayer = (req, res) => {
    Player.deleteOne({ _id: req.params.PlayerId }, (err, Player) => {
        if (err) {
            res.send(err);
        }
        res.json({ message: "Successfully deleted player" });
    });
};
