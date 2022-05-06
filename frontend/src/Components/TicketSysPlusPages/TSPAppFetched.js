import React, {Suspense} from "react";
import TSPApp from "./TSPApp";

function TSPAppFetched(props) {
    const waitingMessage =
        <div className="container">
            <h1 className="text-center text-danger">API data loading...</h1>
        </div>

    return(
        <Suspense fallback={waitingMessage}>
            <TSPApp login={true} />
        </Suspense>
        )
}

export default TSPAppFetched;