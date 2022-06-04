import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import React from "react";
import { Col, Row } from "react-bootstrap";

import { loginRequest } from "../../authConfig";
import NavBar from "../NavBar";

import AdminJson from "./AdminJson";
import Responders from "./Responders";
import {Container} from "@mui/material";


function Admin() {
    const authRequest = {
        ...loginRequest
    };

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            <NavBar />
            <Row className={"me-0"}>
                <Col>
                    <AdminJson />
                </Col>
                <Col xs={2} id="sidebar-right">
                    <Row className={"m-2 justify-content-center"}>
                        <Responders/>
                    </Row>
                </Col>
            </Row>

        </MsalAuthenticationTemplate>
    );
}

export default Admin;
