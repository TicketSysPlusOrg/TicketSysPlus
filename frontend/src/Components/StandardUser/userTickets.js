//list of all the current standard user's tickets
import React, {useEffect, useState} from "react";
import {Col, Container, Modal} from "react-bootstrap";
import {azureConnection} from "../../index";
import {loginRequest} from "../../authConfig";
import SingleTicket from "./singleTicket";
import { AiFillEye } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
import { FiAlertOctagon } from "react-icons/fi";
import TicketForm from "./ticketForms";

function UserTickets(props) {
    const authRequest = {
        ...loginRequest
    };

    /*modal show and hide*/
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [ticketInfo, setTicketInfo] = useState(null);

    function showTicketModal(ticketData){
        setTicketInfo(ticketData.split("|"));
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

        const getProj = await azureConnection.getProject(props.projects[0]);
        console.log(getProj);
        setActiveProj(getProj.name);
        setActivePrjId(getProj.id);

        const allWorkItems = await azureConnection.getPrjWorkItems(getProj.name, getProj.defaultTeam.id);

        if(allWorkItems.workItems !== undefined) {
            const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
            const ticketBatch = await azureConnection.getWorkItems(props.projects[0], listOfIds);
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
        const blockTicket = {"System.State": "Blocked"};
        const updateTicket = azureConnection.updateWorkItem(activePrjID, itemID, {"fields": blockTicket});
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
            {noTickets ?
                <Col xs={12}>
                    <p>{noTickets}</p>
                </Col> :
                devOpsTix ?
                    devOpsTix.value.map((devTix, index) => (
                        <Col xs={12} key={index}>
                            {/*TODO: double check that areapath will always be filled*/}
                            <div className={"projectSelect " }>
                                <Container className={"my-1 py-1 px-0 row hoverOver"} >
                                    <Col xs={1} className={"align-self-center"}>
                                        <div>
                                            <a title={"Inspect Ticket"} onClick={() => {setRenderEdit(false); showTicketModal(devTix.fields["System.AreaPath"] + "|" + devTix.id);}} className={"eyeSee"}><AiFillEye size={"2rem"} /></a>
                                        </div>
                                    </Col>
                                    <Col xs={3}>
                                        <div className={"mx-2 cardOneLine"}>
                                            <strong >{devTix.fields["System.Title"]}</strong>
                                        </div>
                                    </Col>
                                    <Col xs={6}>
                                        <div className={"mx-2 d-inline-block"}><strong>ID</strong>: {devTix.id}</div>
                                        <div  className={"mx-2 d-inline-block"}>
                                            <strong>Priority</strong>: {devTix.fields["Microsoft.VSTS.Common.Priority"]}
                                        </div>
                                        <div className={"mx-2 d-inline-block"} onLoad={() => setBlockStateChange(devTix.fields["System.State"])}>
                                            <strong>State</strong>: {devTix.fields["System.State"]}
                                        </div>
                                        <div  className={"mx-2 d-inline-block"}>
                                            {/*TODO: remove the extra ternary check for no due date present once we require due date for ticket creation*/}
                                            <strong>Due Date</strong>: {devTix ? (devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null) : null}
                                        </div>
                                        <div  className={"ms-2 "}>
                                            <strong>Assigned To</strong>: {getNameBeforeEmail(devTix.fields["System.AssignedTo"])}
                                        </div>
                                    </Col>
                                    <Col xs={2} className={"align-self-center d-flex flex-row-reverse justify-content-between"}>
                                        {/*TODO: this is hard coded to our org. fix that.*/}
                                        <a title={"See DevOps Entry"} className={"mx-1 userTicketBtns"} href={`https://dev.azure.com/KrokhalevPavel/MotorQ%20Project/_workitems/edit/${devTix.id}`} rel={"noreferrer"} target={"_blank"} ><TiArrowForwardOutline size={"1.5rem"}/></a>
                                        <a title={"Edit Ticket"} className={"mx-1 userTicketBtns"} onClick={() => {setRenderEdit(true); setAllTicketInfo(devTix); showTicketModal(devTix.fields["System.AreaPath"] + "|" + devTix.id);}}><FaPencilAlt size={"1.5rem"}/></a>
                                        <a title={"Block Ticket"} className={"mx-1 userTicketBtns"} onClick={() => {blockTicket(devTix.id); setBlockStateChange("Blocked");}}><FiAlertOctagon size={"1.5rem"}/></a>
                                    </Col>
                                </Container>
                            </div>

                        </Col>))

                    : <Col xs={12}>
                        <p>Loading tickets...</p>
                    </Col>
            }

            <Modal show={show} onHide={handleClose} >
                <Modal.Dialog className="shadow-lg mx-3">
                    <Modal.Body>
                        {renderEdit === true ?
                            <TicketForm editTicket={true} ticketInfo={allTicketInfo}  />
                            :
                            <SingleTicket ticketData={ticketInfo} clickClose={handleClose} renderTicket={renderEdit} ticketInfo={allTicketInfo}/>
                        }
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>


        </>
    );
}

export default UserTickets;
