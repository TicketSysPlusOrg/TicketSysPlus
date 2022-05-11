import React, {Suspense} from "react";
import NewTicketModal from "./NewTicketModal";


function NewTicketFetched() {
    const waitingMessage =
        <div className="container">
            <h1 className="text-center text-danger">Ticket data loading...</h1>
        </div>;

    return(
        <Suspense fallback={waitingMessage}>
            <NewTicketModal />
        </Suspense>
    );
}

export default NewTicketFetched;
