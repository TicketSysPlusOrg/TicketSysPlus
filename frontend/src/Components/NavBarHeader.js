import React, {useCallback, useEffect, useState} from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./TicketSysPlusPages/TSPApp.css";
import NewTicketFetched from "./TicketSysPlusPages/NewTicketFetched";
import {Modal, Button, Collapse, ButtonGroup, Navbar, Row, NavbarBrand, Nav, Container, Offcanvas} from "react-bootstrap";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "./graph";

function NavBarHeader(props) {
    const currLocation = useLocation();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);

    const [toggle, setToggle] = useState(false);
    const toggleFunc = useCallback(() => setToggle(!toggle));
    const toggleBlur = () => {if(toggle) {toggleFunc();}};

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


    function logout() {
        instance.logoutRedirect({account: accounts[0]});
    }

    return (
        <>
            <Navbar  sticky="top" expand="md" bg="light" variant="light" className="shadow">
                <NavbarBrand className="mx-4 mt-3  ">
                    <a className="navbar-brand ms-3"  href="https://motorq.com/" rel="noreferrer" target="_blank">
                        {/*//TODO: replace with better quality motorq logo*/}
                        <img id="motorqLogo" src="/motorqLogo.png" alt="Orange Motorq Logo" className="img-fluid pe-2" />
                        <p className="ms-5" id="ts-color"><strong>TicketSystem+</strong></p>
                    </a>
                </NavbarBrand>
                <Navbar.Toggle aria-controls={"offcanvasNavbar-expand-tickets"} />
                <Navbar.Offcanvas id={"offcanvasNavbar-expand-tickets"} aria-labelledby={"offcanvasNavbarLabel-expand-tickets"} placement="end" className="justify-content-end w-25" >
                    <Offcanvas.Header closeButton />

                    <Offcanvas.Body>
                        <Nav className="me-2 ms-auto">

                            <ButtonGroup className="mt-md-2">

                                <div>
                                    <Button className="makeTicket mx-3" onClick={handleShow}>
                                        Create Ticket
                                    </Button>
                                </div>
                                {currLocation.pathname !== "/" ?
                                    <NavLink to="/" >
                                        <Button className="btn btn-primary mx-3">USER PAGE</Button>
                                    </NavLink>
                                    : null
                                }
                                {currLocation.pathname !== "/admin" ?
                                    <NavLink to="/admin">
                                        <Button className="btn btn-primary mx-3">ADMIN PAGE</Button>
                                    </NavLink>
                                    : null
                                }
                                {/*TODO: make this a custom button. don't overuse bootstrap.  */}
                                <div>
                                    <Button onClick={toggleFunc} onBlur={toggleBlur} className="ms-3 " id="userBtn">
                                        {graphData ? graphData.displayName : "Loading..."}
                                    </Button>
                                    <Collapse in={toggle}  id="userCollapse" >
                                        <div>
                                            <Button onClick={logout} className="ms-4">Logout</Button>
                                        </div>
                                    </Collapse>
                                </div>
                            </ButtonGroup>

                        </Nav>

                    </Offcanvas.Body>

                </Navbar.Offcanvas>

            </Navbar>

            {/*TODO: extract to separate component?*/}
            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog className="shadow-lg">

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

export default NavBarHeader;
