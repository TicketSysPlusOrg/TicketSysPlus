//list of all the current standard user's tickets
import React, {useEffect, useState} from "react";
import {Card, Col, Modal} from "react-bootstrap";
import {azureConnection} from "../../index";
import {loginRequest} from "../../authConfig";
import SingleTicket from "./singleTicket";
import { AiFillEye } from "react-icons/ai";
import { FaPencilAlt } from "react-icons/fa";
import { TiArrowForwardOutline } from "react-icons/ti";

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
                                <Card className={"my-1"} >
                                    <Card.Body className={"row"}>
                                        <Col xs={11}>
                                            <Card.Title className={"cardOneLine "}>{devTix.fields["System.Title"]}</Card.Title>
                                            <Card.Text className={"mx-3 d-inline-block"}><u>ID</u>: {devTix.id}</Card.Text>
                                            <Card.Text  className={"mx-3 d-inline-block"}>
                                                <u>Priority</u>: {devTix.fields["Microsoft.VSTS.Common.Priority"]}
                                            </Card.Text>
                                            <Card.Text  className={"mx-3 d-inline-block"}>
                                                <u>State</u>: {devTix.fields["System.State"]}
                                            </Card.Text>
                                            <Card.Text  className={"mx-3 d-inline-block"}>
                                                {/*TODO: remove the extra ternary check for no due date present once we require due date for ticket creation*/}
                                                <u>Due Date</u>: {devTix ? (devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null) : null}
                                            </Card.Text>
                                            <Card.Text  className={"mx-3 d-inline-block"}>
                                                <u>Assigned To</u>: {devTix.fields["System.AssignedTo"]}
                                            </Card.Text>
                                        </Col>
                                        <Col xs={1} className={"d-flex flex-column-reverse"}>
                                            <a onClick={() => showTicketModal(devTix.fields["System.AreaPath"] + "|" + devTix.id)}><AiFillEye size={"2rem"} /></a>
                                            {/*<a><FaPencilAlt size={"2rem"}/></a>*/}
                                            <br/>
                                            <a href={`https://dev.azure.com/KrokhalevPavel/MotorQ%20Project/_workitems/edit/${devTix.id}`}><TiArrowForwardOutline size={"2rem"}/></a>
                                        </Col>

                                    </Card.Body>
                                </Card>
                            </div>

                        </Col>))

                    : <Col xs={12}>
                        <p>Loading tickets...</p>
                    </Col>
            }

            <Modal show={show} onHide={handleClose} >
                <Modal.Dialog className="shadow-lg mx-3">
                    <Modal.Body>
                        <SingleTicket ticketData={ticketInfo} clickClose={handleClose}/>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        </>
    );
}

export default UserTickets;
