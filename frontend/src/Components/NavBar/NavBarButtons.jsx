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
// TODO: uncomment to hide admin page & settings page to non-admins
// import { isAdmin } from "../../utils/Util";


function NavBarButtons({ setShow, show, currLocation, btnVertSpace, vertOrNot }) {
    const [btnStyles, setBtnStyles] = useState("adminButton btn mx-2");
    const [actvStyles, setActvStyles] = useState("makeTicket btn mx-2");
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);


    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    const [graphData, setGraphData] = useState(null);
    // TODO: set to false to hide admin page & settings page to non-admins
    const [admin, setAdmin] = useState(true);

    useEffect(() => {
        // Silently acquires an access token which is then attached to a request for MS Graph data
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(async response => {
                setGraphData(response);
                // TODO: uncomment to hide admin page & settings page to non-admins
                // setAdmin(await isAdmin(response.mail));
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
    }, [accounts, account, instance]);


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

    function toggleName(e) {
        const name = graphData.displayName;

    }

    return (
        <>
            <ButtonGroup className={vertOrNot}>

                <div>
                    <Button className={btnVertSpace + "btn mx-2 " + btnStyles} onClick={handleShow}>
                        Create Ticket
                    </Button>
                </div>
                <div>
                    <NavLink to="/" >
                        <Button className=
                            {currLocation.pathname == "/" ? btnVertSpace + actvStyles : btnVertSpace + btnStyles}>
                            Tickets</Button>
                    </NavLink>
                </div>
                <div>
                    {admin ?
                        <NavLink to="/admin">
                            <Button className=
                                {currLocation.pathname == "/admin" ? btnVertSpace + actvStyles : btnVertSpace + btnStyles}>
                                Admin Page</Button>
                        </NavLink>
                        : null
                    }
                </div>
                <div>
                    {admin ?
                        <NavLink to="/settings" >
                            <Button className=
                                {currLocation.pathname == "/settings" ? btnVertSpace + actvStyles : btnVertSpace + btnStyles}>
                                Settings</Button>
                        </NavLink>
                        : null
                    }
                </div>
                {/*TODO: https://mui.com/material-ui/react-menu/#basic-menu  */}
                <div>
                    <Button onClick={logout}
                        onBlur={toggleBlur}
                        onMouseEnter={() => setToggle(true)}
                        onMouseLeave={() => setToggle(false)}
                        className={btnVertSpace + "adminButton ms-3 pr-5"} >

                        <p className={toggle ? "invisible" : " "}>
                            {graphData ? graphData.displayName : "Loading..."}
                        </p>

                        <p className="logOutButton text-decoration-underline">
                            {toggle ? "Logout" : " "}
                        </p>
                    </Button>

                </div>

            </ButtonGroup>

            <Modal show={show} onHide={handleClose} size={"lg"}>
                <Modal.Dialog className={"mx-3"}>

                    <Modal.Header closeButton>
                        <Modal.Title>Make a Ticket</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <TicketForm editTicket={false} setShow={setShow} key={setShow} />
                    </Modal.Body>

                </Modal.Dialog>
            </Modal>

        </>
    );
}

NavBarButtons.propTypes = {
    currLocation: PropTypes.object,
    btnVertSpace: PropTypes.string,
    vertOrNot: PropTypes.string,
    setShow: PropTypes.func,
    show: PropTypes.bool,
};

export default NavBarButtons;
