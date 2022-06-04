import { Button, ButtonGroup, Collapse, Modal } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import React from "react";
import { useCallback, useState, useEffect } from "react";
import { useMsal, useAccount } from "@azure/msal-react";
import { InteractionRequiredAuthError, BrowserUtils } from "@azure/msal-browser";
import PropTypes from "prop-types";

import { loginRequest } from "../../authConfig";
import { callMsGraph } from "../../utils/MsGraphApiCall";
import TicketForm from "../User/TicketForm";


function NavBarButtons({ currLocation, btnVertSpace, vertOrNot }) {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    const [graphData, setGraphData] = useState(null);

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
    }, [account, instance]);


    const [toggle, setToggle] = useState(false);
    const toggleFunc = useCallback(() => setToggle(!toggle));
    const toggleBlur = () => { if (toggle) { toggleFunc(); } };

    function logout() {
        instance.logoutRedirect({
            account: account,
            postLogoutRedirectUri: window.location.origin,
            onRedirectNavigate: () => !BrowserUtils.isInIframe()
        });
    }

    return (
        <>
            <ButtonGroup className={vertOrNot}>

                <div>
                    <Button className={btnVertSpace + "btn makeTicket mx-2"} onClick={handleShow}>
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
                        <TicketForm />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

        </>
    );
}

NavBarButtons.propTypes = {
    currLocation: PropTypes.object,
    btnVertSpace: PropTypes.string,
    vertOrNot: PropTypes.string
};

export default NavBarButtons;
