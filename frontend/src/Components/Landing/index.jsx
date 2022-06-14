import { useMsal } from "@azure/msal-react";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { loginRequest } from "../../authConfig";


function Landing() {
    const authRequest = {
        ...loginRequest
    };
    const { instance } = useMsal();

    return (
        <Container className="vh-100 landingBody" >
            <Row className="justify-content-center">
                <Col md="auto" className="mt-5">
                    <div className="mt-5 container landingBox p-5 border border-4 shadow-lg">
                        <img id="motorqLogo" src="/motorqLogo.svg" width="270" alt="Orange Motorq Logo" className="img-fluid pe-2" />
                        <p className="ms-5 landing"><strong>TicketSystem+</strong></p>
                        <p className="lead">Click below to log in through your Azure DevOps account</p>
                        <Button className="shadow" variant="success" onClick={() => instance.loginRedirect(authRequest)}>Log In</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Landing;
