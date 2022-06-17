import React, { createRef, useEffect, useState } from "react";
import { Nav, Navbar, NavbarBrand, Offcanvas } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import NavBarButtons from "./NavBarButtons";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Navbar component containing buttons to populate navbar and window size measurement to trigger offcanvas or not.
 * @param {props} show helps trigger tickets view reload in parent component.
 * @param {props} setShow helps trigger tickets view reload in parent component.
 * @param {props} iterationPath the sprint that tickets will be created for. used in ticket creation.
 * @returns {JSX.Element} NavBar component
 */
function NavBar({ show, setShow, iterationPath }) {
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
    }, [width]);

    function navigateHome(event) {
        event.preventDefault();
        navigate("/");
    }

    return (
        <>
            <Navbar expand="md" variant="light" className=" p-0 m-0" id={"navBg"}>

                <NavbarBrand className="mx-4  mb-1">
                    <a className="navbar-brand ms-3" href={window.location.origin} onClick={navigateHome}>

                        <img id="motorqLogo" src="/motorqLogo.svg" width="110" alt="Orange Motorq Logo" className="img-fluid pe-2" />

                        <strong id="ts-color">TicketSystem+</strong>
                    </a>
                </NavbarBrand>
                <Navbar.Toggle aria-controls={"offcanvasNavbar-expand-tickets"} />

                <Navbar.Offcanvas ref={classRef} id={"offcanvasNavbar-expand-tickets"} aria-labelledby={"offcanvasNavbarLabel-expand-tickets"} placement="end" className={" justify-content-end "} >
                    <Offcanvas.Header closeButton />
                    <Offcanvas.Body>
                        <Nav className="me-2 ms-auto mt-2">

                            <NavBarButtons currLocation={currLocation} btnVertSpace={vertSpace} vertOrNot={vertOrNot} setShow={setShow} show={show} iterationPath={iterationPath} />

                        </Nav>

                    </Offcanvas.Body>
                </Navbar.Offcanvas>

            </Navbar>
        </>
    );

}

NavBar.propTypes = {
    show: PropTypes.bool,
    setShow: PropTypes.func
};

export default NavBar;
