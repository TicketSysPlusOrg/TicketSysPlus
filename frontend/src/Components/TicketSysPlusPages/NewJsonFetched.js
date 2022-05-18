import React, { Suspense } from "react";
import NewJsonModal from "./NewJsonModal";


function NewJsonFetched() {
    const waitingMessage =
        <div className="container">
            <h1 className="text-center text-danger">JSON data loading...</h1>
        </div>;

    return (
        <Suspense fallback={waitingMessage}>
            <NewJsonModal />
        </Suspense>
    );
}

export default NewJsonFetched;
