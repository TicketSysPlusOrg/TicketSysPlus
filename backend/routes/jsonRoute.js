import express from "express";

import {
    addJson,
    changeJson,
    deleteJson,
    getJson
} from "../controllers/jsonController";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Backend routes for jsonController.js
 * GET/POST/PUT/DELETE
 */

const router = express.Router();

router
    .get("/", getJson)
    .post("/", addJson)
    .put("/", changeJson)
    .delete("/", deleteJson);

export default router;
