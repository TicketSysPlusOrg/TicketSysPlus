import React, { useState } from "react";
import {NavLink, useLocation} from 'react-router-dom'
import './TicketSysPlusPages/TSPApp.css'
import NewTicketFetched from "./TicketSysPlusPages/NewTicketFetched";
import { Modal, Button } from 'react-bootstrap';


function NavBarHeader(props) {
    const currLocation = useLocation();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <>
            <nav className="navbar navbar-light bg-light shadow">
                <div className="container-fluid row align-content-between">
                        <div className="mx-5 my-2 col-3">
                            <a className="navbar-brand ms-4 " href="https://motorq.com/" rel="noreferrer" target="_blank">
                                <img id="motorqLogo" src="/motorqLogo.png" alt="Orange Motorq Logo"
                                     className="img-responsive pe-2"/>
                                <p className="d-inline-block" id="ts-color"><strong>TicketSystem+</strong></p>
                            </a>
                        </div>
                        <div className="col-7 d-flex justify-content-end mt-4">
                            <Button className="makeTicket" variant="primary" onClick={handleShow}>
                                Create Ticket
                            </Button>
                            {currLocation.pathname !== "/" ?
                                <NavLink to="/">
                                    <button type="button" className='btn btn-primary mx-3'>TEST PAGE</button>
                                </NavLink>
                                : null
                            }
                            {currLocation.pathname !== "/user" ?
                                <NavLink to="/user" >
                                    <button type="button" className="btn btn-primary mx-3">USER PAGE</button>
                                </NavLink>
                                : null
                            }
                            {currLocation.pathname !== "/admin" ?
                                <NavLink to="/admin">
                                    <button type="button" className="btn btn-primary mx-3">ADMIN PAGE</button>
                                </NavLink>
                                : null
                            }
                            {/*TODO: make this a custom button. don't overuse bootstrap.*/}
                            <button className="btn ms-3" id="userBtn" type="button">User's Name Here</button>
                        </div>
                </div>
            </nav>

            {/*TODO: extract to separate component?*/}
            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog className="modal-dialog">

                        <Modal.Header closeButton>
                            <Modal.Title>Make a Ticket</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <NewTicketFetched />
                        </Modal.Body>

                        {/*<Modal.Footer>*/}
                        {/*    <Button variant="primary" onClick={handleClose} type="submit" name="action">*/}
                        {/*        Create Ticket*/}
                        {/*    </Button>*/}
                        {/*</Modal.Footer>*/}
                </Modal.Dialog>
            </Modal>
        </>
    )

}

export default NavBarHeader;