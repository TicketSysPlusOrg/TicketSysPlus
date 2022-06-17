import React, { useEffect, useState } from "react";
import { Col, Container, Modal } from "react-bootstrap";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import BlockIcon from "@mui/icons-material/Block";
import PropTypes from "prop-types";
import { IconButton, CircularProgress, Tooltip } from "@mui/material";

import { azureConnection } from "../../index";
import { getSettings } from "../../utils/Util";

import Ticket from "./Ticket";
import TicketForm from "./TicketForm";

/*get only name from username + email string*/
/**
 * This component retrieves only a name from a name + email string.
 * @param {props} thisString the name + email string.
 * @returns {string} just the username.
 */
export function getNameBeforeEmail(thisString) {
    if(thisString !== undefined) {
        let findName = thisString;
        return findName.substring(0, findName.indexOf("<"));
    }
}

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * The tickets component creates a row/column-based display for all DevOps tickets.
 * @param {props} projects the chosen project for ticket viewing.
 * @param {props} rerender when triggered, re-renders tickets being shown.
 * @param {props} iterationPath the admin settings-chosen sprint path for ticket creation.
 * @returns {JSX.Element} Tickets component.
 */
function Tickets({ projects, rerender, iterationPath }) {
    /*modal show and hide*/
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    /*ticket info*/
    const [ticketInfo, setTicketInfo] = useState([]);

    /*blocking id corresponds with ticket whose blocking state has been changed by onclick event*/
    const [blockingId, setLoadingBlockId] = useState(null);

    /*getting org/project info for opening ticket in DevOps*/
    const [currentOrgInfo, setCurrentOrgInfo] = useState(null);

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

        console.log(`path: ${iterationPath}`);

        var getProj = await azureConnection.getProject(projects[0]);
        console.log(getProj);
        setActiveProj(getProj.name);
        setActivePrjId(getProj.id);

        setCurrentOrgInfo(azureConnection.url);

        const allWorkItems = await azureConnection.getPrjWorkItems(getProj.name, getProj.defaultTeam.id);

        if(allWorkItems.workItems !== undefined) {
            const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
            const ticketBatch = await azureConnection.getWorkItems(projects[0], listOfIds);
            setDevOpsTix(ticketBatch["value"]);
            console.log(ticketBatch["value"]);
        } else {
            setNoTickets("This project has no tickets!");
        }
    }

    /*if renderEdit is true when ticket view is activated, the editTicket view will be available, otherwise the ticket will be view only*/
    const [renderEdit, setRenderEdit] = useState(null);
    const [allTicketInfo, setAllTicketInfo] = useState(null);

    /*set this ticket's state to blocked*/
    async function blockTicket(itemID, currentState, itemAreaPath) {
        setLoadingBlockId(itemID);
        if(currentState !== "Blocked") {
            const blockTicketToggle = { "System.State": "Blocked" };
            const updateTicket = await azureConnection.updateWorkItem(itemAreaPath, itemID, { "fields": blockTicketToggle }, "fields");
        } else {
            const blockTicketToggle = { "System.State": "Active" };
            const updateTicket = await azureConnection.updateWorkItem(itemAreaPath, itemID, { "fields": blockTicketToggle }, "fields");
        }
        setLoadingBlockId(null);
    }

    /*trigger tickets rerender on state change (i.e. changing to blocked*/
    const [blockStateChange, setBlockStateChange] = useState(null);

    /*run render again when blockStateChange is changed from null via blocking a ticket*/
    /*run render again when rerender is changed (this is a prop from user index triggered by creation/edit of a ticket from ticket modal accessed by navbar)*/
    /*run render again when show changes (triggered by close or submit of edit ticket function accessed by tickets page)*/
    useEffect(() => {
        run();
        setBlockStateChange(null);
    }, [blockStateChange !== null, rerender, show]);

    /*if ticket is blocked, give it a red border+*/
    function stateColor(currentState) {
        if(currentState === "Blocked" || currentState === "Removed") {
            return "redTag";
        } else {
            return "";
        }
    }

    /*sorts displayed tickets by parameter (id, priority, etc.)*/
    function clickSort(sortParam, secondSortParam) {
        const checkArr = [...devOpsTix];
        console.log(checkArr);
        let sortArr = [...devOpsTix].sort((thisTicket, nextTicket) => secondSortParam === null ?
            (thisTicket[sortParam] < nextTicket[sortParam] ? 1 : thisTicket[sortParam] > nextTicket[sortParam] ? -1 : 0)
            : (thisTicket[sortParam][secondSortParam] < nextTicket[sortParam][secondSortParam] ? 1 :
                thisTicket[sortParam][secondSortParam] > nextTicket[sortParam][secondSortParam] ? -1 : 0));
        console.log(sortArr);
        if(sortArr[0] === checkArr[0]) {
            sortArr = sortArr.reverse();
        }
        setDevOpsTix(sortArr);
    }

    /*returns the generic iteration path or sprint path following / if there is one*/
    function splitPath(iterationInfo) {
        const splitInfo = iterationInfo.split("\\");
        return splitInfo[splitInfo.length - 1];
    }

    return (
        <>
            {/* future development opportunity: Replace this div with a metrics box, for Ex:
                <> blocked tickets
                <> priority 3 tickets
                <> priority 2 tickets
                <> priority 1 tickets
                ...etc

                clicking them filters the tickets to only those tickets (only blocked tickets, only p3 tickets, etc.)
            */}
            <div className={"mt-4"}></div>
            <Col xs={12} className={"pe-0"}>
                <div className={"projectSelect"}>
                    <Container fluid className={"my-1 py-1 px-0 row infoBar cardOneLine align-items-center fw-bold text-decoration-underline"} >
                        <Col xs={1} className={"ps-4"}><a href={"#"} onClick={() => clickSort("id", null)} className={"sortTicket"}>ID</a></Col>
                        <Col xs={2}><a href={"#"} onClick={() => clickSort("fields", "System.Title")}  className={"sortTicket"}>Title</a></Col>
                        <Col xs={1}><a href={"#"} onClick={() => clickSort("fields", "Microsoft.VSTS.Common.Priority")} className={"sortTicket"}>Priority</a></Col>
                        <Col xs={1}><a href={"#"} onClick={() => clickSort("fields", "Microsoft.VSTS.Scheduling.DueDate")} className={"sortTicket"}>Due Date</a></Col>
                        <Col xs={1}><a href={"#"} onClick={() => clickSort("fields", "System.IterationPath")} className={"sortTicket"}>Sprint</a></Col>
                        <Col xs={2}><a href={"#"} onClick={() => clickSort("fields", "System.AssignedTo")} className={"sortTicket"}>Assigned To</a></Col>
                        <Col xs={1}><a href={"#"} onClick={() => clickSort("fields", "System.State")} className={"sortTicket"}>State</a></Col>
                        <Col xs={3} className={"d-flex justify-content-around "}>
                            <div className={"ps-2 align-self-center"}>View</div>
                            <div className={"ps-3 align-self-center "}>Edit</div>
                            <div className={"ps-3 align-self-center"}>Block</div>
                            <div className={"align-self-center"}>DevOps</div>
                        </Col>
                    </Container>
                </div>
            </Col>
            {noTickets ?
                <Col xs={12} className={"pe-0"}>
                    <p>{noTickets}</p>
                </Col> :
                devOpsTix ?
                    devOpsTix.map((devTix, index) => (
                        <Col xs={12} className={"pe-0"} key={index} >
                            {/* future development opportunity: https://mui.com/material-ui/react-stack/ */}
                            <div className={"projectSelect"}>

                                {/* future development opportunity: Convert into a data table? https://mui.com/material-ui/react-table/#data-table */}
                                <Container fluid className={stateColor(devTix.fields["System.State"]) + " my-1 py-1 px-0 row hoverOver cardOneLine align-items-center fw-bold "} >
                                    <Col xs={1} className={"ps-4"}>{devTix.id}</Col>
                                    <Col xs={2} className={"ps-3 align-self-center text-capitalize"} title={devTix.fields["System.Title"]}>{devTix.fields["System.Title"]}</Col>
                                    <Col xs={1} className={"ps-4"}>{devTix.fields["Microsoft.VSTS.Common.Priority"]}</Col>
                                    <Col xs={1} title={devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null}>
                                        {devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null}
                                    </Col>
                                    <Col xs={1} title={devTix.fields["System.IterationPath"]}>{splitPath(devTix.fields["System.IterationPath"])}</Col>
                                    <Col xs={2} title={devTix.fields["System.AssignedTo"]}>{getNameBeforeEmail(devTix.fields["System.AssignedTo"])}</Col>
                                    <Col xs={1} title={devTix.fields["System.State"]}>{devTix.fields["System.State"]}</Col>
                                    <Col xs={3} className={"d-flex justify-content-around"}>
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
                                        <Tooltip title={(devTix.fields["System.State"] === "Blocked" ? "Unblock" : "Block") + " Ticket"}>
                                            <IconButton
                                                className={"userTicketBtns"}
                                                color={devTix.fields["System.State"] === "Blocked" ? "error" : "default"}
                                                onClick={() => {
                                                    blockTicket(devTix.id, devTix.fields["System.State"], devTix.fields["System.AreaPath"]);
                                                    setBlockStateChange(devTix.fields["System.State"]);
                                                }}
                                            >
                                                { blockingId !== null && devTix.id === blockingId ? <CircularProgress size={16} /> : <BlockIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={"View in DevOps"}>
                                            <IconButton
                                                color={"primary"}
                                                href={`${currentOrgInfo}/${devTix.fields["System.AreaPath"]}/_workitems/edit/${devTix.id}`}
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

            <Modal show={show} onHide={handleClose} size={"lg"}>
                <Modal.Dialog className={"mx-3"}>
                    <Modal.Body>
                        {renderEdit === true ?
                            <TicketForm ticketData={ticketInfo} editTicket={true} ticketInfo={allTicketInfo} setShow={setShow} iterationPath={iterationPath} />
                            :
                            <Ticket ticketData={ticketInfo} clickClose={handleClose} setShow={setShow} renderTicket={renderEdit} ticketInfo={allTicketInfo}/>
                        }
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>

        </>
    );
}

Tickets.propTypes = {
    projects: PropTypes.array,
    rerender: PropTypes.bool
};

export default Tickets;
