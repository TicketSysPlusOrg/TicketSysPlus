import {
    addNewTicket,
    getTickets,
    getTicketWithPriorityOne, blockTicket
} from "../controllers/ticketController";

const mongoTicketRoutes = (app) => {
    app
        .route("/tix")
        .get(getTickets)
        .post(addNewTicket)
        .put(blockTicket);

    app
        .route("/hottix")
        .get(getTicketWithPriorityOne);
};

export default mongoTicketRoutes;
