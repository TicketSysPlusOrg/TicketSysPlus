import React, {createRef, useCallback, useEffect, useState} from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./TicketSysPlusPages/TSPApp.css";
import {Navbar, NavbarBrand, Nav, Offcanvas} from "react-bootstrap";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "./graph";
import NavBarButtons from "./NavBarButtons";

function NavBarHeader(props) {
    const currLocation = useLocation();

    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState(null);


    const classRef = createRef();
    const [vertOrNot, setVertOrNot] = useState("");
    const [vertSpace, setVertSpace] = useState("");
    const width = window.innerWidth;
    const breakpoint = 768;

    useEffect(() => {
        if(width < breakpoint)
        {
            setVertOrNot("mt-md-2 btn-group-vertical");
            setVertSpace("mt-3");
        } else {
            setVertOrNot("");
            setVertSpace("");
        }
    }, []);

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
            <Navbar  sticky="top" expand="md" bg="light" variant="light" className="shadow ">
                <NavbarBrand className="mx-4 mt-1">
                    <a className="navbar-brand ms-3"  href="https://motorq.com/" rel="noreferrer" target="_blank">
                        {/*//TODO: replace with better quality motorq logo*/}
                        <img id="motorqLogo" src="/motorqLogo.png" alt="Orange Motorq Logo" className="img-fluid pe-2" />
                        <p className="ms-5" id="ts-color"><strong>TicketSystem+</strong></p>
                    </a>
                </NavbarBrand>
                <Navbar.Toggle aria-controls={"offcanvasNavbar-expand-tickets"}  />

                <Navbar.Offcanvas  ref={classRef}  id={"offcanvasNavbar-expand-tickets"} aria-labelledby={"offcanvasNavbarLabel-expand-tickets"} placement="end" className={" justify-content-end "} >
                    <Offcanvas.Header closeButton />

                    <Offcanvas.Body>
                        <Nav className="me-2 ms-auto">

                            <NavBarButtons thisInstance={instance} thisAccount={accounts} thisLocation={currLocation} thisGraphData={graphData} btnVertOrNot={vertSpace} vertOrNot={vertOrNot} />

                        </Nav>

                    </Offcanvas.Body>

                </Navbar.Offcanvas>

            </Navbar>
        </>
    );

}

export default NavBarHeader;
