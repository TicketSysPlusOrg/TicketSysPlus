//list of all the current standard user's tickets
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col, Modal} from "react-bootstrap";
import {azureConnection} from "../../index";
import {loginRequest} from "../../authConfig";
import SingleTicket from "../StandardUser/singleTicket";
import {checkAndRemove} from "../../AppPages";


function TicketPrioList(props) {

    /*modal show and hide*/
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [ticketInfo, setTicketInfo] = useState(null);

    function showTicketModal(event){
        setTicketInfo(event.target.value.split("|"));
        handleShow();
        console.log(event.target.value);
    }

    /*devops api data retrieval*/
    const [devOpsTix, setDevOpsTix] = useState(null);

    useEffect(() => {
        run();
    }, []);

    //TODO: add api method that pulls all WIs by team only.
    //async calls to devops API
    async function run() {
        // console.log(props.projects);
        const allWorkItems = await azureConnection.getAllWorkItems(props.projects[0], props.projects[1]);
        const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
        const ticketBatch = await azureConnection.getWorkItems(props.projects[0], listOfIds);
        setDevOpsTix(ticketBatch);
    }

    return (
        <>
            <h4 className="mt-4">Project Tickets from DevOps</h4>

            {devOpsTix ?
                devOpsTix.value.map((devTix, index) => (
                    <Col xs={12} md={12} xl={12} key={index} >
                        <Card className="my-1 mx-1" key={index} >
                            <Card.Body>
                                <Card.Title>{devTix ? devTix.fields["System.Title"] : null}
                                    <Card.Text>
                                        Priority: {devTix ? devTix.fields["Microsoft.VSTS.Common.Priority"] : null}
                                    </Card.Text>
                                </Card.Title>
                                <Card.Text>
                                    Description: {devTix ? checkAndRemove(devTix.fields["System.Description"]) : null}
                                </Card.Text>

                                <Button className="d-inline-block float-end" size="sm" name="action" value={devTix ? (devTix.fields["System.AreaPath"] + "|" + devTix.id) : null} onClick={showTicketModal}>See ticket</Button>
                            </Card.Body>
                        </Card>
                    </Col> ))

                :   <Col xs={12}>
                    <p>Loading tickets...</p>
                </Col>}

            <Modal show={show} onHide={handleClose}>
                <Modal.Dialog className="shadow-lg mx-3">
                    <Modal.Body closeButton>
                        <SingleTicket ticketData={ticketInfo} />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        </>
    );
}

export default TicketPrioList;
