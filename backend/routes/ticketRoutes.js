import express from "express";
import {ConditionalExample} from "../models/ConditionalExample";

const router = express.Router();

//EXTREMELY SIMPLE. just setup to return the ConditionalExample json file
router.get("/", function (req, res, next) {
    res.send(ConditionalExample);
});

// module.exports = router;
//export your router component to access stuff
export default router;