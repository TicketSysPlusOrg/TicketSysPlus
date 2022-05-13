import React from "react";
import NavBarHeader from "../NavBarHeader";
import AdminJson from "../AdminUser/AdminJsonDisplay";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import { ErrorComponent } from "./ErrorComponent";
import { Loading } from "./Loading";


function Admin() {
    const authRequest = {
        ...loginRequest
    };

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect} 
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent} 
            loadingComponent={Loading}
        >
            <NavBarHeader />
            <AdminJson />
        </MsalAuthenticationTemplate >
    );
}

export default Admin;
