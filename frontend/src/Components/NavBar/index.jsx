import React, { createRef, useEffect, useState } from "react";
import { Nav, Navbar, NavbarBrand, Offcanvas } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import NavBarButtons from "./NavBarButtons";


function NavBar({ show, setShow}) {
    const currLocation = useLocation();
    const navigate = useNavigate();

    const classRef = createRef();
    const [vertOrNot, setVertOrNot] = useState("");
    const [vertSpace, setVertSpace] = useState("");
    const width = window.innerWidth;
    const breakpoint = 768;

    useEffect(() => {
        if (width < breakpoint) {
            setVertOrNot("mt-md-2 btn-group-vertical");
            setVertSpace("mt-3");
        } else {
            setVertOrNot("");
            setVertSpace("");
        }
    }, []);

    function navigateHome(event) {
        event.preventDefault();
        navigate("/");
    }

    return (
        <>
            <Navbar expand="md" variant="light" className=" p-0 m-0" id={"navBg"}>

                <NavbarBrand className="mx-4  mb-1">
                    <a className="navbar-brand ms-3" href={window.location.origin} onClick={navigateHome}>

                        <img id="motorqLogo" src="/motorqLogo.png" width="120" alt="Orange Motorq Logo" className="img-fluid pe-2" />

                        {/*//TODO: replace with better quality motorq logo*/}
                        <strong id="ts-color">TicketSystem+</strong>
                    </a>
                </NavbarBrand>
                <Navbar.Toggle aria-controls={"offcanvasNavbar-expand-tickets"} />

                {/* TODO: Remove since we don't care about mobile responsiveness */}
                <Navbar.Offcanvas ref={classRef} id={"offcanvasNavbar-expand-tickets"} aria-labelledby={"offcanvasNavbarLabel-expand-tickets"} placement="end" className={" justify-content-end "} >
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body>
                        <Nav className="me-2 ms-auto mt-2">

                            <NavBarButtons currLocation={currLocation} btnVertSpace={vertSpace} vertOrNot={vertOrNot} setShow={setShow} show={show}/>

                        </Nav>

                    </Offcanvas.Body>
                </Navbar.Offcanvas>

            </Navbar>
        </>
    );

}

export default NavBar;
