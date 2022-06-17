import express from "express";

import {
    addAdmin,
    changeAdmin,
    deleteAdmin,
    getAdmin
} from "../controllers/adminController";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Backend routes for adminController.js
 * GET/POST/PUT/DELETE
 */

const router = express.Router();

router
    .get("/", getAdmin)
    .post("/", addAdmin)
    .put("/", changeAdmin)
    .delete("/", deleteAdmin);

export default router;
