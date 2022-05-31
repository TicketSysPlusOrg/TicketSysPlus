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

    function showTicketModal(ticketData){
        setTicketInfo(ticketData.split("|"));
        handleShow();
    }

    const [ticketArray, setTickets] = useState([]);

    //regex remove html entities from string if not null, undefined, or empty string
    function checkAndRemoveNoFormat(stringInput) {
        if (stringInput === undefined || stringInput == null || stringInput.trim() === "") {
            return stringInput;
        }
        return stringInput.replace(/(<([^>]+)>)|(&nbsp;)/gi, "");
    }

    /*axios database function calls*/
    function blockTicket(userID) {
        axios
            .put("http://localhost:4001/tix", {
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
            .delete("http://localhost:4001/tix", {
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
        .get("http://localhost:4001/tix")
        .then((res) => {
            setTickets(res.data);
        })
        .catch((err) => {
            console.log(err);
        });

    /*devops api data retrieval*/
    const [devOpsTix, setDevOpsTix] = useState(null);
    const [noTickets, setNoTickets] = useState(null);
    const [activeProj, setActiveProj] = useState(null);

    useEffect(() => {
        run();
    }, []);

    //TODO: can I see if tickets related to project exist prior to running the getAllWorkItems function?
    //async calls to devops API
    async function run() {

        const getProj = await azureConnection.getProject(props.projects[0]);
        console.log(getProj);
        setActiveProj(getProj.name);

        const allWorkItems = await azureConnection.getPrjWorkItems(getProj.name, getProj.defaultTeam.id);
        console.log(allWorkItems);
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
                        <Col xs={12} md={6} xl={4} key={index}>
                            {/*TODO: double check that areapath will always be filled*/}
                            <div onClick={() => showTicketModal(devTix.fields["System.AreaPath"] + "|" + devTix.id)} className={"projectSelect"}>
                                <Card className={"my-1 mt-1 mb-3"} >
                                    <Card.Body>
                                        <Card.Title
                                            className={"cardOneLine mb-2"}>{devTix ? devTix.fields["System.Title"] : null}</Card.Title>
                                        <Card.Text className={"cardOneLine"}>
                                            <u>Description</u>: {devTix ? checkAndRemoveNoFormat(devTix.fields["System.Description"]) : null}
                                        </Card.Text>
                                        <Card.Text className={"cardOneLine"}>
                                            <u>Priority</u>: {devTix ? devTix.fields["Microsoft.VSTS.Common.Priority"] : null}
                                        </Card.Text>
                                        <Card.Text className={"cardOneLine"}>
                                            {/*TODO: remove the extra ternary check for no due date present once we require due date for ticket creation*/}
                                            <u>Due Date</u>: {devTix ? (devTix.fields["Microsoft.VSTS.Scheduling.DueDate"] ? devTix.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10) : null) : null}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>

                        </Col>))

                    : <Col xs={12}>
                        <p>Loading tickets...</p>
                    </Col>
            }

            <h4 className={"mt-4"}>Project Tickets from DB</h4>

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

            <Modal show={show} onHide={handleClose} >
                <Modal.Dialog className="shadow-lg mx-3">
                    <Modal.Body>
                        <SingleTicket ticketData={ticketInfo} />
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        </>
    );
}

export default TSPlist;
