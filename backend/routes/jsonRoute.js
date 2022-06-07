import express from "express";

import {
    addJson,
    changeJson,
    deleteJson,
    getJson
} from "../controllers/jsonController";


const router = express.Router();

router
    .get("/", getJson)
    .post("/", addJson)
    .put("/", changeJson)
    .delete("/", deleteJson);

export default router;
