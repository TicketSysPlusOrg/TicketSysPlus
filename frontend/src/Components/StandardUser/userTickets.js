//list of all the current standard user's tickets
import React, {useEffect, useState} from "react";
import {Col, Container, Modal} from "react-bootstrap";
import {azureConnection} from "../../index";
import {loginRequest} from "../../authConfig";
import SingleTicket from "./singleTicket";
import { AiFillEye } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";
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

    useEffect(() => {
        run();
    }, []);

    //async calls to devops API
    async function run() {

        const getProj = await azureConnection.getProject(props.projects[0]);
        console.log(getProj);
        setActiveProj(getProj.name);

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

    return (
        <>
            <h4 className={"mt-4"}>Displaying Tickets for: {activeProj}</h4>
            {noTickets ?
                <Col xs={12}>
                    <p>{noTickets}</p>
                </Col> :
                devOpsTix ?
                    devOpsTix.value.map((devTix, index) => (
                        <Col xs={12} key={index}>
                            {/*TODO: double check that areapath will always be filled*/}
                            <div className={"projectSelect"}>
                                <Container className={"my-1 py-1 px-0 row bg-white"} >
                                    <Col xs={1} className={"align-self-center"}>
                                        <div>
                                            <a onClick={() => showTicketModal(devTix.fields["System.AreaPath"] + "|" + devTix.id)} className={"eyeSee"}><AiFillEye size={"2rem"} /></a>
                                        </div>
                                    </Col>
                                    <Col xs={3}>
                                        <div className={"mx-2 d-inline-block "}>
                                            <strong >{devTix.fields["System.Title"]}</strong>
                                        </div>
                                    </Col>
                                    <Col xs={7}>
                                        <div className={"mx-2 d-inline-block"}><strong>ID</strong>: {devTix.id}</div>
                                        <div  className={"mx-2 d-inline-block"}>
                                            <strong>Priority</strong>: {devTix.fields["Microsoft.VSTS.Common.Priority"]}
                                        </div>
                                        <div className={"mx-2 d-inline-block"}>
                                            <strong>State</strong>: {devTix.fields["System.State"]}
                                        </div>
                                        <div  className={"mx-2 d-inline-block"}>
                                            {/*TODO: remove the extra ternary check for no due date present once we require due date for ticket creation*/}
                                            <strong>Due Date</strong>: {devTix ? (devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null) : null}
                                        </div>
                                        <div  className={"mx-3 "}>
                                            <strong>Assigned To</strong>: {getNameBeforeEmail(devTix.fields["System.AssignedTo"])}
                                        </div>
                                    </Col>
                                    <Col xs={1} className={"align-self-center d-flex flex-row-reverse"}>
                                        <a href={`https://dev.azure.com/KrokhalevPavel/MotorQ%20Project/_workitems/edit/${devTix.id}`} rel={"noreferrer"} target={"_blank"} ><TiArrowForwardOutline size={"1.5rem"}/></a>
                                        <a className={"mx-1"} onClick={() => {setRenderEdit(true); setAllTicketInfo(devTix); showTicketModal(devTix.fields["System.AreaPath"] + "|" + devTix.id);}}><FaPencilAlt size={"1.5rem"}/></a>
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
