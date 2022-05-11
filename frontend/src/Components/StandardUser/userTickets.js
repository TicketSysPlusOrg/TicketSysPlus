//list of all of the current standard user's tickets
import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Card, Button, Col} from 'react-bootstrap';


function TSPlist() {
    const [ticketArray, setTickets] = useState([]);

    axios
        .get('http://localhost:4001/tix')
        .then((res) => {
            setTickets(res.data);
        })
        .catch((err) => {
            console.log(err)
        });

    return (
        <>
            <h4>Tickets</h4>

            {ticketArray.map((thisTicket) => (
                <Col sm={3} key={thisTicket._id}>
                    <Card className="my-3 mx-4" key={thisTicket._id}>
                        <Card.Body>
                            <Card.Title>{thisTicket.title}</Card.Title>
                            <Card.Text>
                                {thisTicket.description}
                            </Card.Text>
                            <Button variant="primary">Block Ticket</Button>
                            <Button variant="secondary">Cancel Ticket</Button>
                        </Card.Body>
                    </Card>
                </Col>

            ))}
        </>
        )

}

export default TSPlist;