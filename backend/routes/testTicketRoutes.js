import {
    addNewTicket,
    getTickets,
    getTicketWithPriorityOne,
    blockTicket,
    deleteTicket,
    addJson,
    changeJson,
    deleteJson,
    getJson
} from "../controllers/ticketController";



const mongoTicketRoutes = (app) => {
    app
        .route("/tix")
        .get(getTickets)
        .post(addNewTicket)
        .put(blockTicket)
        .delete(deleteTicket);

    app
        .route("/hottix")
        .get(getTicketWithPriorityOne);

    app
        .route("/jsons")
        .get(getJson)
        .post(addJson)
        .put(changeJson)
        .delete(deleteJson);


};

export default mongoTicketRoutes;
