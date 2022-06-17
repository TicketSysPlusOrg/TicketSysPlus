import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useMsal, useAccount } from "@azure/msal-react";

import { loginRequest } from "../../authConfig";
import NavBar from "../NavBar";
import { isAdmin } from "../../utils/Util";

import Responders from "./Responders";
import JsonViewer from "./JsonViewer";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Admin page component. Calls navbar, responders, and JSON viewer components.
 * @returns {JSX.Element} Admin component.
 */
function Admin() {
    const authRequest = {
        ...loginRequest
    };

    const [admin, setIsAdmin] = useState(false);

    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    
    /*child changes to show trigger tickets rerender. needed for rerender after ticket creation*/
    const [show, setShow] = useState(false);

    useEffect(() => {
        (async () => {
            setIsAdmin(await isAdmin(account.username));
            // setIsAdmin(false);
        })();
    }, []);

    return (
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            <NavBar show={show} setShow={setShow} />
            <Row className={"me-0"}>
                <Col xs={10} id={"inset-shadow"}>
                    <JsonViewer isAdmin={admin}/>
                </Col>
                <Col xs={2} id={"sidebar-right"}>
                    <Row className={"m-2 justify-content-center"}>
                        <Responders isAdmin={admin}/>
                    </Row>
                </Col>
            </Row>

        </MsalAuthenticationTemplate>
    );
}

export default Admin;
