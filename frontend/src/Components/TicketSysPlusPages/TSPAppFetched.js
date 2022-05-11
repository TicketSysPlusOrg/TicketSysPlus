import React, {Suspense} from "react";
import TSPApp from "./TSPApp";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import { ErrorComponent } from "./ErrorComponent";
import { Loading } from "./Loading";


function TSPAppFetched(props) {
    const authRequest = {
        ...loginRequest
    };

    const waitingMessage =
        <div className="container">
            <h1 className="text-center text-danger">API data loading...</h1>
        </div>;

    return(
        <Suspense fallback={waitingMessage}>
            <MsalAuthenticationTemplate
                interactionType={InteractionType.Popup} 
                authenticationRequest={authRequest} 
                errorComponent={ErrorComponent} 
                loadingComponent={Loading}
            >
                <TSPApp login={true} />
            </MsalAuthenticationTemplate >
        </Suspense>
    );
}

export default TSPAppFetched;
