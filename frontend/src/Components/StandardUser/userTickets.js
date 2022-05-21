//list of all the current standard user's tickets
import React, {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col} from "react-bootstrap";
import {Context} from "../../AppPages";
import {azureConnection} from "../../index";

function TSPlist() {
    const [ticketArray, setTickets] = useState([]);
    //TODO: finish useContext data path
    const [context, setContext] = useContext(Context);

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

    const [devOpsTix, setDevOpsTix] = useState(null);

    useEffect(() => {
        (async () => {
            const projects = await azureConnection.getProjects();
            console.log(projects);
            const ticketBatch = await azureConnection.getWorkItems(projects.value[0].id, ("1,2,3"));
            console.log(ticketBatch);

            setDevOpsTix(ticketBatch);
        })();
    }, []);

    return (
        <>
            <h4 className="mt-4">Project Tickets from DevOps</h4>

            {devOpsTix ?

                devOpsTix.value.map((devTix, index) => (
                    <Col xs={12} md={6} xl={3} key={index} >
                        {/*<h1>{devOpsTix ? devOpsTix.value[index].fields['System.Title'] : null}</h1>*/}
                        <Card className="my-1 mx-1" key={index} >
                            <Card.Body>
                                <Card.Title>{devOpsTix ? devOpsTix.value[index].fields['System.Title'] : null}</Card.Title>
                                <Card.Text>
                                    {devOpsTix ? devOpsTix.value[index].fields['System.Description'] : null}
                                </Card.Text>
                                <Card.Text>
                                    Priority: {devOpsTix ? devOpsTix.value[index].fields['System.Priority'] : null}
                                </Card.Text>
                                <Button onClick={() => deleteTicket(null)} className="d-inline-block float-end" size="sm" type="submit" name="action">Cancel</Button>
                            </Card.Body>
                        </Card>
                    </Col> ))

                : null}


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
