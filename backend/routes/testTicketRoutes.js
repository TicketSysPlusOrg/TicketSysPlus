import {
    addNewTicket,
    getTickets,
    getTicketWithPriorityOne, updateTicket
} from "../controllers/ticketController";

const mongoTicketRoutes = (app) => {
    app
        .route('/tix')
        .get(getTickets)
        .post(addNewTicket)
        .put(updateTicket);

    app
        .route('/hottix')
        .get(getTicketWithPriorityOne);
};

export default mongoTicketRoutes;