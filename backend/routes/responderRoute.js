import express from "express";

import {
    addResponder,
    changeResponder,
    deleteResponder,
    getResponder
} from "../controllers/responderController";


const router = express.Router();

router
    .get("/", getResponder)
    .post("/", addResponder)
    .put("/", changeResponder)
    .delete("/", deleteResponder);

export default router;
