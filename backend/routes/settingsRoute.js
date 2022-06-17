import express from "express";

import {
    addSettings,
    changeSettings,
    deleteSettings,
    getSettings
} from "../controllers/settingsController";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Backend routes for settingsController.js
 * GET/POST/PUT/DELETE
 */

const router = express.Router();

router
    .get("/", getSettings)
    .post("/", addSettings)
    .put("/", changeSettings)
    .delete("/", deleteSettings);

export default router;
