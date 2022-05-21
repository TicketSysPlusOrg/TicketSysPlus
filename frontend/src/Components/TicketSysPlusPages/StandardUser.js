import React, {useState} from "react";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import { ErrorComponent } from "./ErrorComponent";
import { Loading } from "./Loading";

import NavBarHeader from "../NavBarHeader";
import PrjSideBar from "../StandardUser/ProjectsSideBar";
import UserTickets from "../StandardUser/userTickets";
import {Col, Container, Row} from "react-bootstrap";
import {Context} from "../../AppPages";

function StandardUser(props) {
    const authRequest = {
        ...loginRequest
    };
    /*context allowing sidebar to pass team/prj/etc to user tickets component*/
    //TODO: finish this function
    const [context, setContext] = useState(null);

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect} 
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent} 
            loadingComponent={Loading}
        >
            <NavBarHeader />
            <Row>
                <Context.Provider value={[context, setContext]}>
                    <Col xs={3} id="sidebar">
                        <PrjSideBar />
                    </Col>
                    <Col xs={8}>
                        <Container>
                            <Row>
                                <UserTickets />
                            </Row>
                        </Container>
                    </Col>
                </Context.Provider>

            </Row>

        </MsalAuthenticationTemplate >
    );
}

export default StandardUser;
