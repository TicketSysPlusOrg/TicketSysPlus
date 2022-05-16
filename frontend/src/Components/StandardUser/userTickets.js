//list of all of the current standard user's tickets
import React, {useState} from "react";
import axios from "axios";
import {Button, Card, Col} from "react-bootstrap";


function TSPlist() {
    const [ticketArray, setTickets] = useState([]);

    // function blockedColor(blockState) {
    //     return blockState ?  : null;
    // }


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

    return (
        <>
            <h4 className="mt-4">Project Tickets</h4>

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
