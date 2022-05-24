import {Button, ButtonGroup, Collapse, Modal} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import React from "react";
import {useCallback, useState} from "react";
import NewTicketFetched from "./TicketSysPlusPages/NewTicketFetched";

function NavBarButtons(props) {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);


    const vertOrNot = props.vertOrNot;
    const graphData = props.thisGraphData;
    const currLocation = props.thisLocation;
    const instance = props.thisInstance;
    const accounts = props.thisAccount;
    const btnVertSpace = props.btnVertOrNot;

    const [toggle, setToggle] = useState(false);
    const toggleFunc = useCallback(() => setToggle(!toggle));
    const toggleBlur = () => {if(toggle) {toggleFunc();}};

    function logout() {
        instance.logoutRedirect({account: accounts[0]});
    }

    return (
        <>
            <ButtonGroup className={vertOrNot}>

                <div>
                    <Button className={btnVertSpace + " makeTicket mx-3"} onClick={handleShow}>
                      Create Ticket
                    </Button>
                </div>
                {currLocation.pathname !== "/home" ?
                    <NavLink to="/home" >
                        <Button className={btnVertSpace +" btn btn-primary mx-3"}>USER PAGE</Button>
                    </NavLink>
                    : null
                }
                {currLocation.pathname !== "/admin" ?
                    <NavLink to="/admin">
                        <Button className={btnVertSpace +" btn btn-primary mx-3"}>ADMIN PAGE</Button>
                    </NavLink>
                    : null
                }
                {/*TODO: make this a custom button. don't overuse bootstrap.  */}
                <div>
                    <Button onClick={toggleFunc} onBlur={toggleBlur} className={btnVertSpace +" ms-3"} id="userBtn">
                        {graphData ? graphData.displayName : "Loading..."}
                    </Button>
                    <Collapse in={toggle}  id="userCollapse" >
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
                        <NewTicketFetched />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

        </>
    );
}

export default NavBarButtons;
