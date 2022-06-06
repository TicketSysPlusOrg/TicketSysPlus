import React, { useEffect, useState } from "react";
import { Col, Container, Modal } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BlockIcon from "@mui/icons-material/Block";
import PropTypes from "prop-types";

import { azureConnection } from "../../index";

import Ticket from "./Ticket";
import TicketForm from "./TicketForm";
import { IconButton, CircularProgress, Tooltip } from "@mui/material";

/*get only name from username + email string*/
export function getNameBeforeEmail(thisString) {
    if(thisString !== undefined) {
        let findName = thisString;
        return findName.substring(0, findName.indexOf("<"));
    }
}

function Tickets({ projects }) {
    /*modal show and hide*/
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [ticketInfo, setTicketInfo] = useState([]);
    const [blockingId, setLoadingBlockId] = useState(null);

    function showTicketModal(ticketData){
        setTicketInfo(ticketData);
        handleShow();
    }

    /*devops api data retrieval*/
    const [devOpsTix, setDevOpsTix] = useState(null);
    const [noTickets, setNoTickets] = useState(null);
    const [activeProj, setActiveProj] = useState(null);
    const [activePrjID, setActivePrjId] = useState(null);

    useEffect(() => {
        run();
    }, []);

    //async calls to devops API
    async function run() {

        if (projects === null) return;

        const getProj = await azureConnection.getProject(projects[0]);
        console.log(getProj);
        setActiveProj(getProj.name);
        setActivePrjId(getProj.id);

        const allWorkItems = await azureConnection.getPrjWorkItems(getProj.name, getProj.defaultTeam.id);

        if(allWorkItems.workItems !== undefined) {
            const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
            const ticketBatch = await azureConnection.getWorkItems(projects[0], listOfIds);
            setDevOpsTix(ticketBatch);
            console.log(ticketBatch);
        } else {
            setNoTickets("This project has no tickets!");
        }
    }

    const [renderEdit, setRenderEdit] = useState(null);
    const [allTicketInfo, setAllTicketInfo] = useState(null);

    /*set this ticket's state to blocked*/
    async function blockTicket(itemID, currentState) {
        setLoadingBlockId(itemID);
        if(currentState !== "Blocked") {
            const blockTicket = { "System.State": "Blocked" };
            const updateTicket = await azureConnection.updateWorkItem(activePrjID, itemID, { "fields": blockTicket });
        } else {
            const blockTicket = { "System.State": "Active" };
            const updateTicket = await azureConnection.updateWorkItem(activePrjID, itemID, { "fields": blockTicket });
        }
        setLoadingBlockId(null);
    }

    /*trigger tickets rerender on state change (i.e. changing to blocked*/
    const [blockStateChange, setBlockStateChange] = useState(null);

    /*run render again*/
    useEffect(() => {
        run();
        setBlockStateChange(null);
    }, [blockStateChange !== null]);

    function stateColor(currentState) {
        if(currentState === "Blocked" || currentState === "Removed") {
            return "redTag";
        } else if(currentState === "Done" || currentState === "Closed") {
            return "greenTag";
        } else {
            return "";
        }
    }

    return (
        <>
            {/* TODO: Replace this div with a metrics box, for Ex:
                <> blocked tickets
                <> priority 3 tickets
                <> priority 2 tickets
                <> priority 1 tickets
                ...etc

                clicking them filters the tickets to only those tickets (only blocked tickets, only p3 tickets, etc.)
            */}
            <div className={"mt-4"}></div>
            <Col xs={12} className={"pe-0"}>
                <div className={"projectSelect " }>
                    <Container fluid className={"my-1 py-1 px-0 row hoverOver cardOneLine align-items-center fw-bold text-decoration-underline"} >
                        <Col xs={1} className={"ps-3"}>View</Col>
                        <Col xs={1}>ID</Col>
                        <Col xs={3}>Title</Col>
                        <Col xs={1}>Priority</Col>
                        <Col xs={1}>Due Date</Col>
                        <Col xs={2}>Assigned To</Col>
                        <Col xs={1}>State</Col>
                        <Col xs={2} className={"d-flex justify-content-around"}>
                            <div className={"ps-1 align-self-center"}>Block</div>
                            <div className={"ps-2 align-self-center"}>Edit</div>
                            <div className={"align-self-center"}>See Page</div>
                        </Col>
                    </Container>
                </div>
            </Col>
            {noTickets ?
                <Col xs={12} className={"pe-0"}>
                    <p>{noTickets}</p>
                </Col> :
                devOpsTix ?
                    devOpsTix.value.map((devTix, index) => (
                        <Col xs={12} className={"pe-0"} key={index} >
                            {/*TODO: double check that areapath will always be filled*/}
                            {/* TODO: https://mui.com/material-ui/react-stack/ */}
                            <div className={"projectSelect"}>
                                {/* TODO: Convert into a data table? https://mui.com/material-ui/react-table/#data-table */}
                                {/* TODO: Look into making ONLY the tickets scrollable, not the sidebar */}
                                <Container fluid className={stateColor(devTix.fields["System.State"]) + " my-1 py-1 px-0 row hoverOver cardOneLine align-items-center fw-bold "} >
                                    <Col xs={1} className={"ps-3 d-flex"}>
                                        <Tooltip title={"Inspect Ticket"}>
                                            <IconButton
                                                className={"eyeSee"}
                                                onClick={() => {
                                                    setRenderEdit(false);
                                                    showTicketModal([devTix.fields["System.AreaPath"], devTix.id]);
                                                }}
                                            >
                                                <VisibilityIcon sx={{ fontSize: "1.7rem" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </Col>
                                    <Col xs={1}>{devTix.id}</Col>
                                    <Col xs={3} title={devTix.fields["System.Title"]}>{devTix.fields["System.Title"]}</Col>
                                    <Col xs={1}>{devTix.fields["Microsoft.VSTS.Common.Priority"]}</Col>
                                    {/*TODO: remove the extra ternary check for no due date present once we require due date for ticket creation*/}
                                    <Col xs={1} title={devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null}>
                                        {devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null}
                                    </Col>
                                    <Col xs={2} title={devTix.fields["System.AssignedTo"]}>{getNameBeforeEmail(devTix.fields["System.AssignedTo"])}</Col>
                                    <Col xs={1} title={devTix.fields["System.State"]}>{devTix.fields["System.State"]}</Col>
                                    <Col xs={2} className={"d-flex justify-content-around"}>
                                        <Tooltip title={(devTix.fields["System.State"] === "Blocked" ? "Unblock" : "Block") + " Ticket"}>
                                            <IconButton
                                                className={"userTicketBtns"}
                                                color={devTix.fields["System.State"] === "Blocked" ? "error" : "default"}
                                                onClick={() => {
                                                    blockTicket(devTix.id, devTix.fields["System.State"]);
                                                    setBlockStateChange(devTix.fields["System.State"]);
                                                }}
                                            >
                                                { blockingId !== null && devTix.id === blockingId ? <CircularProgress size={16} /> : <BlockIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={"Edit Ticket"}>
                                            <IconButton
                                                color={"primary"}
                                                className={"userTicketBtns"}
                                                onClick={() => {
                                                    setRenderEdit(true);
                                                    setAllTicketInfo(devTix);
                                                    showTicketModal([devTix.fields["System.AreaPath"], devTix.id]);
                                                }}
                                            >
                                                <ModeEditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {/*TODO: this is hard coded to our org. fix that.*/}
                                        <Tooltip title={"View in DevOps"}>
                                            <IconButton
                                                color={"primary"}
                                                href={`https://dev.azure.com/KrokhalevPavel/MotorQ%20Project/_workitems/edit/${devTix.id}`}
                                                rel={"noreferrer"}
                                                target={"_blank"}
                                                className={"userTicketBtns"}
                                            >
                                                <OpenInNewIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Col>
                                </Container>
                            </div>

                        </Col>))

                    : <Col xs={12}>
                        <p>Loading tickets...</p>
                    </Col>
            }

            <Modal show={show} onHide={handleClose} >
                <Modal.Dialog className=" mx-3">
                    <Modal.Body>
                        {renderEdit === true ?
                            <TicketForm editTicket={true} ticketInfo={allTicketInfo}  />
                            :
                            <Ticket ticketData={ticketInfo} clickClose={handleClose} renderTicket={renderEdit} ticketInfo={allTicketInfo}/>
                        }
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>


        </>
    );
}

Tickets.propTypes = {
    projects: PropTypes.array
};

export default Tickets;
