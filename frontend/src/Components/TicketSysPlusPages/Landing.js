import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

export const Landing = () => {
    return (
        <Container>
            <Row className="justify-content-center">
                <Col md="auto">
                    <div className="mt-5">

                        <img id="motorqLogo" src="/motorqLogo.png" alt="Orange Motorq Logo" className="img-fluid pe-2" />
                        <p className="ms-5" id="ts-color"><strong>TicketSystem+</strong></p>
                        <p>Click below to log in through your Azure DevOps account</p>
                        <Button href="/home" variant="success">Log In</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Landing;
