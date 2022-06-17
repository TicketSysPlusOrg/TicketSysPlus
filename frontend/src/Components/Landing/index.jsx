import { useMsal } from "@azure/msal-react";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { loginRequest } from "../../authConfig";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Landing page for initial access to Ticket System Plus application.
 * @returns {JSX.Element} Landing component.
 */
function Landing() {
    const authRequest = {
        ...loginRequest
    };
    const { instance } = useMsal();

    return (
        <Container className="vh-100 landingBody" >
            <Row className="justify-content-center">
                <Col md="auto" className="mt-5">
                    <div id={"landBoxBorder"} className="mt-5 container landingBox p-5 shadow-lg">
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
