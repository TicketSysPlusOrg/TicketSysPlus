import React, { useEffect, useState } from "react";
import { Col, Container, Modal } from "react-bootstrap";
import { AiFillEye } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import { FiAlertOctagon } from "react-icons/fi";
import { TiArrowForwardOutline } from "react-icons/ti";
import PropTypes from "prop-types";

import { azureConnection } from "../../index";

import Ticket from "./Ticket";
import TicketForm from "./TicketForm";


function Tickets({ projects }) {
    /*modal show and hide*/
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [ticketInfo, setTicketInfo] = useState([]);

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

    /*get only name from username + email string*/
    function getNameBeforeEmail(thisString) {
        if(thisString !== undefined) {
            let findName = thisString;
            return findName.substring(0, findName.indexOf("<"));
        }
    }

    const [renderEdit, setRenderEdit] = useState(null);
    const [allTicketInfo, setAllTicketInfo] = useState(null);

    /*set this ticket's state to blocked*/
    async function blockTicket(itemID) {
        const blockTicket = { "System.State": "Blocked" };
        const updateTicket = azureConnection.updateWorkItem(activePrjID, itemID, { "fields": blockTicket });
    }

    /*trigger tickets rerender on state change (i.e. changing to blocked*/
    const [blockStateChange, setBlockStateChange] = useState(null);

    /*run render again*/
    useEffect(() => {
        run();
    }, [blockStateChange !== null]);

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
                        <Col xs={3}>Title</Col>
                        <Col xs={1}>ID</Col>
                        <Col xs={1}>Priority</Col>
                        <Col xs={1}>State</Col>
                        <Col xs={1}>Due Date</Col>
                        <Col xs={2}>Assigned To</Col>
                        <Col xs={2} className={"d-flex justify-content-around"}>
                            <div className={"align-self-center"}>Block</div>
                            <div className={"align-self-center"}>Edit</div>
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
                            <div className={"projectSelect " }>
                                <Container fluid className={"my-1 py-1 px-0 row hoverOver cardOneLine align-items-center fw-bold "} >
                                    <Col xs={1} className={"ps-3 d-flex"}>
                                        <div className={"align-self-center"}>
                                            <a title={"Inspect Ticket"} onClick={() => {setRenderEdit(false); showTicketModal([devTix.fields["System.AreaPath"], devTix.id]);}} className={"eyeSee"}><AiFillEye size={"2rem"} /></a>
                                        </div>
                                    </Col>
                                    <Col xs={3} title={devTix.fields["System.Title"]}>{devTix.fields["System.Title"]}</Col>
                                    <Col xs={1}>{devTix.id}</Col>
                                    <Col xs={1}>{devTix.fields["Microsoft.VSTS.Common.Priority"]}</Col>
                                    <Col xs={1} title={devTix.fields["System.State"]}>{devTix.fields["System.State"]}</Col>
                                    {/*TODO: remove the extra ternary check for no due date present once we require due date for ticket creation*/}
                                    <Col xs={1} title={devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null}>
                                        {devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null}
                                    </Col>
                                    <Col xs={2} title={devTix.fields["System.AssignedTo"]}>{getNameBeforeEmail(devTix.fields["System.AssignedTo"])}</Col>
                                    <Col xs={2} className={"d-flex justify-content-around"}>
                                        {/*TODO: this is hard coded to our org. fix that.*/}
                                        <a title={"Block Ticket"} className={"userTicketBtns"} onClick={() => {blockTicket(devTix.id); setBlockStateChange("Blocked");}}><FiAlertOctagon size={"1.5rem"}/></a>
                                        <a title={"Edit Ticket"} className={"userTicketBtns"} onClick={() => {setRenderEdit(true); setAllTicketInfo(devTix); showTicketModal([devTix.fields["System.AreaPath"], devTix.id]);}}><FaPencilAlt size={"1.5rem"}/></a>
                                        <a title={"See DevOps Entry"} className={"userTicketBtns"} href={`https://dev.azure.com/KrokhalevPavel/MotorQ%20Project/_workitems/edit/${devTix.id}`} rel={"noreferrer"} target={"_blank"} ><TiArrowForwardOutline size={"1.5rem"}/></a>
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
