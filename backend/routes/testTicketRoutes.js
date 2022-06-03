import {
    addJson,
    changeJson,
    deleteJson,
    getJson
} from "../controllers/jsonController";
import {
    addResponder,
    changeResponder,
    deleteResponder,
    getResponder
} from "../controllers/responderController";


const mongoTicketRoutes = (app) => {
    app
        .route("/jsons")
        .get(getJson)
        .post(addJson)
        .put(changeJson)
        .delete(deleteJson);

    app
        .route("/responders")
        .get(getResponder)
        .post(addResponder)
        .put(changeResponder)
        .delete(deleteResponder);


};

export default mongoTicketRoutes;
