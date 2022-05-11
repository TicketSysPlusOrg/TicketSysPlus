import express from "express";
import {TicketSchema} from "../models/BaseSchemaJS";

const routerSchema = express.Router();

//EXTREMELY SIMPLE. just setup to return the BaseSchema json file
routerSchema.get("/", function (req, res, next) {
    res.send(TicketSchema);
});

//export your router component to access stuff
export default routerSchema;