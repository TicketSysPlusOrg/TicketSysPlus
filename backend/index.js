import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cors from "cors";
// import routes from './routes/testTicketRoutes';
import mongoTicketRoutes from "./routes/testTicketRoutes";
import ticketRouter from "./routes/ticketRoutes";
import tickSchemaRoute from "./routes/tickSchemaRoute";

const app = express();
const PORT = 4001;

//mongo connection: lib simplifies connections to mongo and allows shorter syntax for queries
//mongo will tell us we're connected and we will get promise response
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).catch(error => console.log("Could not connect to MongoDB Database"));

//bodyparser setup
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

//CORS setup
app.use(cors());

//pass routes to express app. routes now available
mongoTicketRoutes(app);

//pass ticket route(s) to express app
app.use("/ticketInfo", ticketRouter);
app.use("/ticketSchema", tickSchemaRoute);


app.get("/", (req, res) => {
    res.send(`Our Ticket app is running on port ${PORT}.`);
});

//this actually opens up the server/starts the server on port 4001
app.listen(PORT, () => {
    console.log(`Your server is running on port ${PORT}.`);
});
