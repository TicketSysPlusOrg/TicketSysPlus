import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cors from "cors";

import  responderRoute from "./routes/responderRoute";
import  jsonRoute from "./routes/jsonRoute";
import  adminRoute from "./routes/adminRoute";
import  settingsRoute from "./routes/settingsRoute";

const app = express();
const PORT = 4001;

//mongo connection: lib simplifies connections to mongo and allows shorter syntax for queries
//mongo will tell us we're connected and we will get promise response
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Successfully connected to MongoDB Database"))
    .catch(error => console.error(`ERROR: ${error.message}`));

//bodyparser setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//cors setup
app.use(cors());

app.use("/jsons", jsonRoute);

app.use("/responders", responderRoute);

app.use("/admins", adminRoute);

app.use("/settings", settingsRoute);

//this actually opens up the server/starts the server on port 4001
app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}.`);
});
