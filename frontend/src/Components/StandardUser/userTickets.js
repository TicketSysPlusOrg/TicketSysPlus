//list of all the current standard user's tickets
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col} from "react-bootstrap";
import {azureConnection} from "../../index";

function TSPlist(props) {
    const [ticketArray, setTickets] = useState([]);

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
    const [projects, setProjectsList] = useState(props.projects);

    //rerun run when projects changes.
    useEffect(() => {
        run();
    }, [projects]);

    //TODO: add api method that pulls all WIs by team only.
    function run() {
        (async () => {
            const allWorkItems = await azureConnection.getAllWorkItems(projects[0], projects[1]);
            const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
            const ticketBatch = await azureConnection.getWorkItems(projects[0], listOfIds);
            setDevOpsTix(ticketBatch);
        })();
    }

    useEffect(() => {
        setProjectsList(props.projects)
        console.log(projects);
    }, [props.projects])


    return (
        <>
            <h4 className="mt-4">Project Tickets from DevOps</h4>

            {devOpsTix ?
                devOpsTix.value.map((devTix, index) => (
                    <Col xs={12} md={6} xl={3} key={index} >
                        <Card className="my-1 mx-1" key={index} >
                            <Card.Body>
                                <Card.Title>{devOpsTix ? devOpsTix.value[index].fields["System.Title"] : null}</Card.Title>
                                <Card.Text>
                                    {devOpsTix ? (devOpsTix.value[index].fields["System.Description"]).replace(/(<([^>]+)>)|(&nbsp;)/gi, "") : null}
                                </Card.Text>
                                <Card.Text>
                                    Priority: {devOpsTix ? devOpsTix.value[index].fields["Microsoft.VSTS.Common.Priority"] : null}
                                </Card.Text>
                                <Button className="d-inline-block float-end" size="sm" type="submit" name="action">Cancel</Button>
                            </Card.Body>
                        </Card>
                    </Col> ))

                :   <Col xs={12}>
                        <p>Click team to load tickets.</p>
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

        </>
    );

}

export default TSPlist;
