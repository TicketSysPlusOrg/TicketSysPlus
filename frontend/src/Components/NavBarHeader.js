import React, {useCallback, useEffect, useState} from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./TicketSysPlusPages/TSPApp.css";
import NewTicketFetched from "./TicketSysPlusPages/NewTicketFetched";
import { Modal, Button, Collapse } from "react-bootstrap";

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
            <nav className="navbar navbar-light bg-light shadow">
                <div className="container-fluid row align-content-between">
                    <div className="mx-5 my-2 col-7 col-md-3">
                        <a className="navbar-brand ms-4 " href="https://motorq.com/" rel="noreferrer" target="_blank">
                            {/*TODO: replace with better quality motorq logo*/}
                            <img id="motorqLogo" src="/motorqLogo.png" alt="Orange Motorq Logo"
                                className="img-fluid pe-2" />
                            <p className="d-inline-block" id="ts-color"><strong>TicketSystem+</strong></p>
                        </a>
                    </div>
                    <div className="col-3 col-md-7 d-flex justify-content-end mt-4">
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
                        {/*TODO: make this collapse show up below name. looks bad right now.*/}
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
                </Modal.Dialog>
            </Modal>
        </>
    );

}

export default NavBarHeader;
