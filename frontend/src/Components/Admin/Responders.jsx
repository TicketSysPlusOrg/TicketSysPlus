import React, { useEffect, useState } from "react";
import { Card, CloseButton, Col, Dropdown, Row } from "react-bootstrap";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { azureConnection } from "../../index";

function Responders() {
    /*devops api data retrieval*/
    const [responders, setResponders] = useState(null);
    const [card, setCard] = useState(null);

    useEffect(() => {
        run();
    }, []);
    useEffect(() => {
        loadResponders();
    }, []);

    async function run() {
        const projects = await azureConnection.getProjects();
        const membersObject = await azureConnection.getAllTeamMembers(projects.value[1].id);

        setResponders(membersObject);
    }

    function APIDropDownToDB(Image, Name, Email){
        axios.post("http://localhost:4001/responders", {
            image: Image,
            name: Name,
            email: Email
        })
            .then((res) => {
                console.log(res);
                loadResponders();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function loadResponders(){
        axios.get("http://localhost:4001/responders")
            .then((res) => {
                console.log(res.data);
                setCard(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function deleteResponder(id){
        console.log(id);
        axios.delete("http://localhost:4001/responders", { data: { "id" : id } })
            .then((res) => {
                console.log(res);
                loadResponders();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const autoResponders = responders ?
        responders.value
            .filter(responder => {
                if (card === null || card.length === 0) return true;
                return card.every(card => card.email !== responder.identity.uniqueName);
            })
            .map((responder) => {
                return { label: responder.identity.displayName, imageUrl: responder.identity.imageUrl, email: responder.identity.uniqueName };
            })
        : [];

    return (
        <>
            <h4 className={"mt-4 text-center"}>On-Call Responders</h4>

            <Autocomplete
                className={"mb-1"}
                disablePortal
                disableCloseOnSelect
                options={autoResponders}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Responders" />}
                onChange={(_event, value, reason) => {
                    if(reason === "selectOption") {
                        APIDropDownToDB(
                            value.imageUrl, value.label, value.email
                        );
                    }
                }}
            />

            {card ?
                card.map((card, index) => (
                    <Col key={index} className={"col-12 mb-1"}>
                        <Card key={index}>
                            <Card.Body className={"text-center"}>
                                <Card.Text className={"text-end d"}><CloseButton onClick={() => deleteResponder(card._id)}/></Card.Text>
                                <Card.Img variant="top" src={card.image} style={{ width: "fit-content", borderRadius: 60/ 2 }}/>
                                <Card.Text>
                                    {card ? card.name : null}
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
