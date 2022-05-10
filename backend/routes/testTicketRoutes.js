import {
    addNewTicket,
    getTickets,
    getTicketWithPriorityOne
} from "../controllers/ticketController";

const mongoTicketRoutes = (app) => {
    app
        .route('/tix')
        .get(getTickets)
        .post(addNewTicket);

    app
        .route('/hottix')
        .get(getTicketWithPriorityOne);
};

export default mongoTicketRoutes;