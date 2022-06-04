import { Button, ButtonGroup, Collapse, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import React from "react";
import { useCallback, useState, useEffect } from "react";

import { useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "./graph";
import TicketForms from "./StandardUser/ticketForms";

function NavBarButtons(props) {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const vertOrNot = props.vertOrNot;
    const currLocation = props.thisLocation;
    const btnVertSpace = props.btnVertOrNot;

    useEffect(() => {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(response => {
                setGraphData(response);
                console.log(response);
            });
        }).catch(async (error) => {
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return await instance.acquireTokenRedirect(loginRequest).catch(error => {
                    console.log(error);
                });
            }
        });
    }, []);


    const [toggle, setToggle] = useState(false);
    const toggleFunc = useCallback(() => setToggle(!toggle));
    const toggleBlur = () => { if (toggle) { toggleFunc(); } };

    function logout() {
        instance.logoutRedirect({ account: accounts[0], postLogoutRedirectUri: window.location.origin });
    }

    return (
        <>
            <ButtonGroup className={vertOrNot}>

                <div>
                    <Button className={btnVertSpace + "btn makeTicket mx-2"} onClick={handleShow} ticketInfo={null}>
                        Create Ticket
                    </Button>
                </div>
                <div>
                    {currLocation.pathname !== "/" ?
                        <NavLink to="/" >
                            <Button className={btnVertSpace + "btn btn-primary  mx-2"}>TICKETS</Button>
                        </NavLink>
                        : null
                    }
                </div>
                {currLocation.pathname !== "/admin" ?
                    <NavLink to="/admin">
                        <Button className={btnVertSpace + " btn adminButton mx-2"}>Admin Page</Button>
                    </NavLink>
                    : null
                }
                {/*TODO: make this a custom button. don't overuse bootstrap.  */}
                <div>
                    <Button onClick={toggleFunc} onBlur={toggleBlur} className={btnVertSpace + "adminButton ms-3"} >
                        {graphData ? graphData.displayName : "Loading..."}
                    </Button>
                    <Collapse in={toggle} id="userCollapse" >
                        <div>
                            <Button onClick={logout} className="ms-4">Logout</Button>
                        </div>
                    </Collapse>
                </div>

            </ButtonGroup>

            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog className="shadow-lg mx-3">

                    <Modal.Header closeButton>
                        <Modal.Title>Make a Ticket</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <TicketForms />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

        </>
    );
}

export default NavBarButtons;
