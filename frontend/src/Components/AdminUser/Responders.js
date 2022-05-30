import React, {useEffect, useState} from "react";
import {Button, Card, Col, Modal} from "react-bootstrap";
import {azureConnection} from "../../../index";
import {checkAndRemove} from "../../../AppPages";

function Responders(props) {
    /*devops api data retrieval*/
    const [responders, setResponders] = useState(null);

    useEffect(() => {
        run();
    }, []);

    //async calls to devops API
    async function run() {
        // console.log(props.projects);
        const allWorkItems = await azureConnection.getAllWorkItems(props.projects[0], props.projects[1]);
        const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
        const ticketBatch = await azureConnection.getWorkItems(props.projects[0], listOfIds);
        setResponders(ticketBatch);
    }

    return (
        <>
            <h4 className="mt-4">On-Call Responders</h4>

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

        </>
    );
}

export default Responders;
