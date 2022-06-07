import express from "express";

import {
    addSettings,
    changeSettings,
    deleteSettings,
    getSettings
} from "../controllers/settingsController";


const router = express.Router();

router
    .get("/", getSettings)
    .post("/", addSettings)
    .put("/", changeSettings)
    .delete("/", deleteSettings);

export default router;
