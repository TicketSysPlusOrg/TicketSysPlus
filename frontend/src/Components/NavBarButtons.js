import {Button, ButtonGroup, Collapse, Modal} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import React from "react";
import {useCallback, useState, useEffect} from "react";
import NewTicketFetched from "./TicketSysPlusPages/NewTicketFetched";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "./graph";

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
        });
    }, []);


    const [toggle, setToggle] = useState(false);
    const toggleFunc = useCallback(() => setToggle(!toggle));
    const toggleBlur = () => {if(toggle) {toggleFunc();}};

    function logout() {
        instance.logoutRedirect({account: accounts[0], postLogoutRedirectUri: window.location.origin});
    }

    return (
        <>
            <ButtonGroup className={vertOrNot}>

                <div>
                    <Button className={btnVertSpace + " makeTicket mx-3"} onClick={handleShow} ticketInfo={null}>
                      Create Ticket
                    </Button>
                </div>
                {currLocation.pathname !== "/" ?
                    <NavLink to="/" >
                        <Button className={btnVertSpace +" btn btn-primary mx-3"}>USER PAGE</Button>
                    </NavLink>
                    : null
                }
                {currLocation.pathname !== "/admin" ?
                    <NavLink to="/admin">
                        <Button className={btnVertSpace +" btn btn-primary mx-3"}>ADMIN PAGE</Button>
                    </NavLink>
                    : null
                }
                {/*TODO: make this a custom button. don't overuse bootstrap.  */}
                <div>
                    <Button onClick={toggleFunc} onBlur={toggleBlur} className={btnVertSpace +" ms-3"} id="userBtn">
                        {graphData ? graphData.displayName : "Loading..."}
                    </Button>
                    <Collapse in={toggle}  id="userCollapse" >
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
                        <NewTicketFetched />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

        </>
    );
}

export default NavBarButtons;
