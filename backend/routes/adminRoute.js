import express from "express";

import {
    addAdmin,
    changeAdmin,
    deleteAdmin,
    getAdmin
} from "../controllers/adminController";


const router = express.Router();

router
    .get("/", getAdmin)
    .post("/", addAdmin)
    .put("/", changeAdmin)
    .delete("/", deleteAdmin);

export default router;
