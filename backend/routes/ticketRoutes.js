import express from 'express';
import {ConditionalExample} from "../models/ConditionalExample";

const router = express.Router();

//EXTREMELY SIMPLE. just setup to return the ConditionalExample json file
router.get('/', function (req, res, next) {
    // const thisJSON = {
    //     textData: 'API is working nicely!',
    //     titleData: 'Great API Title',
    //     moreData: 5502,
    // };

    res.send(ConditionalExample);
});

module.exports = router;