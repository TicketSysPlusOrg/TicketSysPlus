import express from "express";

import {
    addResponder,
    changeResponder,
    deleteResponder,
    getResponder
} from "../controllers/responderController";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Backend routes for responderController.js
 * GET/POST/PUT/DELETE
 */

const router = express.Router();

router
    .get("/", getResponder)
    .post("/", addResponder)
    .put("/", changeResponder)
    .delete("/", deleteResponder);

export default router;
