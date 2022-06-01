import React, {useEffect, useState} from "react";
import {Card, Col, Row} from "react-bootstrap";
import {azureConnection} from "../../index";
import {checkAndRemove} from "../../AppPages";
import axios from "axios";

function Responders() {
    /*devops api data retrieval*/
    const [responders, setResponders] = useState(null);

    const [noResponders, setNoResponders] = useState(false);
    const [bypass, setBypass] = useState(true);

    useEffect(() => {
        run();
    }, []);

    async function run() {
        const projects = await azureConnection.getProjects();
        const membersObject = await azureConnection.getAllTeamMembers(projects.value[1].id);


        const member = membersObject.value.map(member => ({name: member.identity.displayName, icon: member.identity.imageUrl, email: member.identity.uniqueName}));
        setResponders(membersObject);
    }


    console.log(responders);
    return (
        <>

            <h4 className={"mt-4 text-center"}>On-Call Responders</h4>


            {responders ?
                responders.value.map((responder, index) => (
                    <Col key={index} className={"col-4"} style={{ width: "20%" }}>
                        <Card style={{ width: "100%" }} key={index}>
                            <Card.Body>
                                <Card.Img variant="top" src={responder.identity.imageUrl} style={{width: "fit-content", borderRadius: 60/ 2}}/>
                                <Card.Text>
                                    {responder ? responder.identity.displayName : null}
                                </Card.Text>
                                <Card.Text>
                                    {responder ? responder.identity.uniqueName : null}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>))
                : null
            }

        </>
    );
}

export default Responders;
