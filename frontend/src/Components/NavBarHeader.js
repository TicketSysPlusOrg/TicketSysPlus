import React from "react";
import {NavLink, useLocation} from 'react-router-dom'
import './TicketSysPlusPages/TSPApp.css'

function NavBarHeader(props) {
    const currLocation = useLocation();
    console.log(currLocation.pathname);

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
                        <div className="col-7 d-flex justify-content-end">
                            <button className="makeTicket" data-bs-toggle="modal" data-bs-target="#makeTicketModal">
                                Create Ticket
                            </button>
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
                            <button className="btn mx-3" id="userBtn" type="button">CurrentUser</button>
                        </div>
                </div>
            </nav>

            {/*TODO: extract to separate component?*/}
            <div className="modal fade" id="makeTicketModal" tabIndex="-1" aria-labelledby="makeTicketModal" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="makeTicketModalLabel">Make a Ticket</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Placeholder Modal Body Text. VERY cool.
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )

}

export default NavBarHeader;