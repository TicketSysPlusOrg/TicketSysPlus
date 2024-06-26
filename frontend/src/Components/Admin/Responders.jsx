import React, { useEffect, useState } from "react";
import { Card, CloseButton, Col, Dropdown, Row } from "react-bootstrap";
import { TextField, Autocomplete, Avatar, Stack } from "@mui/material";

import { backendApi } from "../../index";
import { azureConnection } from "../../index";
import { getSettings } from "../../utils/Util";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Responders component loads an autocomplete dropdown menu that shows members from a project in devops api
 * and when selected, loads that member's name, devops api profile image, and their email onto the admin page
 * as cards as well to the database
 * @param {props} isAdmin shows whether the user can access admin content or not.
 * @returns {JSX.Element} Responders component.
 */
function Responders({ isAdmin }) {
    /*devops api data retrieval*/
    const [responders, setResponders] = useState(null);
    const [card, setCard] = useState(null);

    useEffect(() => {
        run();
    }, []);
    useEffect(() => {
        loadResponders();
    }, []);

    //gets all team members from settings' default project 
    //assigns members from the project to a usestate
    async function run() {
        const settings = await getSettings();

        /*get default project per admin settings panel*/
        let defaultProject = "";
        if (settings !== undefined && settings.length > 0) {
            const settingsObj = JSON.parse(settings[0].body);
            defaultProject = settingsObj.defaultProject;
        }

        const membersObject = await azureConnection.getAllTeamMembers(defaultProject);

        setResponders(membersObject);
    }

    //posts the devops api image, full name, and email of the member that is selected from the
    //responder dropdown menu to the database
    //calls loadResponders to populate the page with updated cards
    function APIDropDownToDB(Image, Name, Email) {
        backendApi.post("responders", {
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

    //populates the page with responder cards
    function loadResponders() {
        backendApi.get("responders")
            .then((res) => {
                console.log(res.data);
                setCard(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //deletes a responder card from the database and calls loadResponders to populate the page with updated cards
    function deleteResponder(id) {
        backendApi.delete("responders", { data: { "id": id } })
            .then((res) => {
                console.log(res);
                loadResponders();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //maps members from the responders usestate to values: label, imageUrl, and email to be displayed in Autocomplete
    //dropdown menu. label == member name, imageUrl == devops api profile picture, email == member email
    const autoResponders = responders ?
        responders.value
            .map((responder) => {
                return { label: responder.identity.displayName, imageUrl: responder.identity.imageUrl, email: responder.identity.uniqueName };
            })
        : [];

    return (
        <>
            <h4 className={"mt-4 text-center onCall lead"} >On-Call Responders</h4>
            <hr />

            <Autocomplete
                disabled={!isAdmin}
                className={"mb-1"}
                disablePortal
                disableCloseOnSelect
                options={autoResponders}
                isOptionEqualToValue={(option, value) => option.label === value.label}
                filterOptions={(options) => {
                    return options.filter(responder => {
                        if (card === null || card.length === 0) return true;
                        return card.every(card => card.email !== responder.email);
                    });
                }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Responders" />}
                onChange={(_event, value, reason) => {
                    if (reason === "selectOption") {
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
                                <Card.ImgOverlay className={"text-end d"}><CloseButton onClick={() => deleteResponder(card._id)} /></Card.ImgOverlay>
                                <div className={"align-content-center"}>
                                    <Avatar
                                        sx={{
                                            bgcolor: "orange",
                                            mx: "auto",
                                            display: "block"
                                        }}
                                        alt={card.name}
                                        src={card.image}
                                    />
                                </div>
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
