import mongoose from 'mongoose';
import {TicketSchema} from "../models/BaseSchemaJS.js";

const Ticket = mongoose.model('Ticket', TicketSchema);

//functions that interact w/ db when sending request to api. request to api w/ route, controller executes func in db

//POST
export const addNewTicket = (req, res) => {
    let newTicket = new Ticket(req.body);

    newTicket.save((err, Ticket) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Ticket);
    });
};

//GET
export const getTickets = (req, res) => {
    Ticket.find((err, Ticket) => {
        //save to DB
        if (err) {
            res.send(err);
        }
        res.json(Ticket);
    });
};

//ANOTHER GET
export const getTicketWithPriorityOne = (req, res) => {
    Ticket.find({priority: 1}, (err, Ticket) => {
        if (err) {
            res.send(err);
        }
        res.json(Ticket);
    });
};

//PUT
export const updateTicket = (req, res) => {
    Ticket.findOneAndUpdate(
        { _id: req.params.TicketId },
        req.body,
        { new: true },
        (err, Ticket) => {
            if (err) {
                res.send(err);
            }
            res.json(Player);
        }
    );
}