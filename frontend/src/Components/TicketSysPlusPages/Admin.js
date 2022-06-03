import React from "react";
import NavBarHeader from "../NavBarHeader";
import AdminJson from "../AdminUser/AdminJsonDisplay";
import {Col, Row} from "react-bootstrap";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import { ErrorComponent } from "./ErrorComponent";
import { Loading } from "./Loading";
import Responders from "../AdminUser/TicketRespondersDisplay";

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

            <Row>
                <Col>
                    <Row className={"m-2 justify-content-center"}>
                        <Responders/>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <AdminJson />
                </Col>
            </Row>

        </MsalAuthenticationTemplate >
    );
}

export default Admin;
