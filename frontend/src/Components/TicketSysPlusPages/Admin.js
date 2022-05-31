import React from "react";
import NavBarHeader from "../NavBarHeader";
import AdminJson from "../AdminUser/AdminJsonDisplay";
import AdminPrio from "../AdminUser/AdminTicketPrioDisplay";
import {Card, Col, Container, Row} from "react-bootstrap";

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

            <Row>
                <Col>

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
