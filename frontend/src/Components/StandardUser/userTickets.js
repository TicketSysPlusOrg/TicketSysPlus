//list of all of the current standard user's tickets
import React, {useState} from "react";
import axios from "axios";
import {Button, Card, Col} from "react-bootstrap";


function TSPlist() {
    const [ticketArray, setTickets] = useState([]);


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
                <Col xs={12} md={6} xl={3} key={thisTicket._id}>
                    <Card className="my-2 mx-2" key={thisTicket._id}>
                        <Card.Body>
                            <Card.Title>{thisTicket.title}</Card.Title>
                            <Card.Text>
                                {thisTicket.blocked ? <strong>Ticket Blocked</strong> : thisTicket.description}
                            </Card.Text>
                            <Card.Text>
                                Due: {thisTicket.due_date} Priority: {thisTicket.priority}
                            </Card.Text>
                            <Button onClick={() => blockTicket(thisTicket._id)} type="submit" name="action">Block Ticket</Button>
                            {/*<Button onClick={() => blockTicket(thisTicket._id)} type="submit" name="action">Block Ticket</Button>*/}
                        </Card.Body>
                    </Card>
                </Col>

            ))}
        </>
    );

}

export default TSPlist;
