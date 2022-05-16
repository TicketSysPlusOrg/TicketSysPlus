import {
    addNewTicket,
    getTickets,
    getTicketWithPriorityOne, blockTicket, deleteTicket
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
};

export default mongoTicketRoutes;
