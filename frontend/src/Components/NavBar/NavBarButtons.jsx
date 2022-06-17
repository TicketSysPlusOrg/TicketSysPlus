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

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Component contains the tickets to be displayed in the navbar on each page.
 * @param {props} setShow helps trigger tickets view reload in parent component
 * @param {props} show helps trigger tickets view reload in parent component
 * @param {props} currLocation decides whether to apply current loaction styling or not
 * @param {props} btnVertSpace switches navbar to offcanvas modal based on screen size
 * @param {props} vertOrNot switches navbar to offcanvas modal based on screen size
 * @param {props} iterationPath the sprint that tickets will be created for. used in ticket creation.
 * @returns {JSX.Element} NavBarButtons component
 */
function NavBarButtons({ setShow, show, currLocation, btnVertSpace, vertOrNot, iterationPath }) {
    const [btnStyles] = useState(" adminButton btn mx-2");
    const [actvStyles] = useState(" makeTicket btn mx-2");
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [graphData, setGraphData] = useState(null);

    /*Silently acquires an access token which is then attached to a request for MS Graph data*/
    useEffect(() => {

        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            callMsGraph(response.accessToken).then(async response => {
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
    }, [accounts, account, instance]);


    const [toggle, setToggle] = useState(false);
    const toggleFunc = useCallback(() => setToggle(!toggle));
    const toggleBlur = () => { if (toggle) { toggleFunc(); } };

    /*logs the user out of their current account session*/
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
                            {currLocation.pathname == "/" ? btnVertSpace + actvStyles + " disableStyle" : btnVertSpace + btnStyles}>
                            Tickets</Button>
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/admin">
                        <Button className=
                            {currLocation.pathname == "/admin" ? btnVertSpace + actvStyles + " disableStyle" : btnVertSpace + btnStyles}>
                                Admin Page</Button>
                    </NavLink>
                </div>
                <div>
                    <NavLink to="/settings" >
                        <Button className=
                            {currLocation.pathname == "/settings" ? btnVertSpace + actvStyles + " disableStyle" : btnVertSpace + btnStyles}>
                                Settings</Button>
                    </NavLink>
                </div>
                {/*TODO: https://mui.com/material-ui/react-menu/#basic-menu  */}
                <div>
                    <Button onClick={logout}
                        onBlur={toggleBlur}
                        onMouseEnter={() => setToggle(true)}
                        onMouseLeave={() => setToggle(false)}
                        className={btnVertSpace + " adminButton ms-3 pr-5"} >

                        <p className={toggle ? "invisible" : " "}>
                            {graphData ? graphData.displayName : "Loading..."}
                        </p>

                        <p className={btnVertSpace ? "logOutButtonVert text-decoration-underline" : "logOutButton text-decoration-underline"}>
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
                        <TicketForm editTicket={false} setShow={setShow} key={setShow} iterationPath={iterationPath} />
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
