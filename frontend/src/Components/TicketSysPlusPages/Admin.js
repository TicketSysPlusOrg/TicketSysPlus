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
                <Col xs={4} sm={3} md={3} id="sidebar">
                    <Container className="d-flex flex-column justify-content-center ">
                        <AdminPrio />
                    </Container>
                </Col>
                <Col xs={5} sm={6} md={6}>
                    <Container>
                        <AdminJson />
                    </Container>
                </Col>
                <Col xs={3} sm={3} md={3} id="sidebar-right">
                    <Container className="d-flex flex-column justify-content-center ">

                    </Container>
                </Col>
            </Row>

        </MsalAuthenticationTemplate >
    );
}

export default Admin;
