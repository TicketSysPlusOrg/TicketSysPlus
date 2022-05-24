//list of all the current standard user's tickets
import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col, Modal} from "react-bootstrap";
import {azureConnection} from "../../index";
import {loginRequest} from "../../authConfig";
import parse from "html-react-parser";
import NewTicketFetched from "../TicketSysPlusPages/NewTicketFetched";
import SingleTicket from "./singleTicket";
import {checkAndRemove} from "../../AppPages";


//TODO: so far, the returned button values are useless due to no proper means of displaying only team-associated tickets
function TSPlist(props) {
    const authRequest = {
        ...loginRequest
    };

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

    const [ticketArray, setTickets] = useState([]);

    // //TODO: Look into parsing the html entities instead of removing them. To Be Discussed/Decided (TBD) in Discord.
    // //regex remove html entities from string if not null, undefined, or empty string
    // function checkAndRemove(stringInput) {
    //     if (stringInput === undefined || stringInput == null || stringInput.trim() === "") {
    //         return stringInput;
    //     }
    //     return parse(stringInput);
    // }

    /*axios database function calls*/
    function blockTicket(userID) {
        axios
            .put("https://backend.granny.dev/tix", {
                _id: userID
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    function deleteTicket(userID) {
        axios
            .delete("https://backend.granny.dev/tix", {
                _id: userID
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    axios
        .get("https://backend.granny.dev/tix")
        .then((res) => {
            setTickets(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

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
                    <Col xs={12} md={6} xl={3} key={index} >
                        <Card className="my-1 mx-1" key={index} >
                            <Card.Body>
                                <Card.Title>{devTix ? devTix.fields["System.Title"] : null}</Card.Title>
                                <Card.Text>
                                    Description: {devTix ? checkAndRemove(devTix.fields["System.Description"]) : null}
                                </Card.Text>
                                <Card.Text>
                                    Priority: {devTix ? devTix.fields["Microsoft.VSTS.Common.Priority"] : null}
                                </Card.Text>
                                {/*TODO: make this button pull up each single ticket clicked on as modal for editing and answering*/}
                                {/*TODO: double check that areapath will always be filled*/}
                                <Button className="d-inline-block float-end" size="sm" name="action" value={devTix ? (devTix.fields["System.AreaPath"] + "|" + devTix.id) : null} onClick={showTicketModal}>See ticket</Button>
                            </Card.Body>
                        </Card>
                    </Col> ))

                :   <Col xs={12}>
                    <p>Loading tickets...</p>
                </Col>}

            <h4 className="mt-4">Project Tickets from DB</h4>

            {ticketArray.map((thisTicket) => (
                <Col xs={12} md={6} xl={3} key={thisTicket._id} >
                    <Card className="my-1 mx-1" key={thisTicket._id} style={thisTicket.blocked ? { border:"0.3rem solid rgb(255, 0, 0)" } : null}>
                        <Card.Body>
                            <Card.Title>{thisTicket.title}</Card.Title>
                            <Card.Text>
                                {thisTicket.blocked ? <strong>Ticket Blocked</strong> : thisTicket.description}
                            </Card.Text>
                            <Card.Text>
                                Due: {thisTicket.due_date} Priority: {thisTicket.priority}
                            </Card.Text>
                            {!thisTicket.blocked? <Button onClick={() => blockTicket(thisTicket._id)} className="d-inline-block" size="sm" type="submit" name="action">Block</Button> : null}

                            <Button onClick={() => deleteTicket(thisTicket._id)} className="d-inline-block float-end" size="sm" type="submit" name="action">Cancel</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}

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

export default TSPlist;
