import React, { useEffect, useState } from "react";
import { Card, CloseButton, Col, Dropdown, Row } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import { Box, Grid } from "@mui/material";

import { backendApi } from "../../index";
import { azureConnection } from "../../index";

function Admins() {
    /*devops api data retrieval*/
    const [admins, setAdmins] = useState(null);
    const [card, setCard] = useState(null);

    useEffect(() => {
        run();
    }, []);
    useEffect(() => {
        loadAdmins();
    }, []);

    async function run() {
        const projects = await azureConnection.getProjects();
        const membersObject = await azureConnection.getAllTeamMembers(projects.value[1].id);

        setAdmins(membersObject);
    }

    function APIDropDownToDB(image, name, email){
        backendApi.post("admins", {
            image: image,
            name: name,
            email: email
        })
            .then((res) => {
                loadAdmins();
            })
            .catch(console.error);
    }

    function loadAdmins(){
        backendApi.get("admins")
            .then((res) => {
                setCard(res.data);
            })
            .catch(console.error);
    }

    function deleteAdmins(id){
        backendApi.delete("admins", { data: { "id" : id } })
            .then((res) => {
                loadAdmins();
            })
            .catch(console.error);
    }

    const adminsList = admins ?
        admins.value
            .map((responder) => {
                return { label: responder.identity.displayName, imageUrl: responder.identity.imageUrl, email: responder.identity.uniqueName };
            })
        : [];

    return (
        <>
            <Grid container className={"mt-4"}>
                <Grid item xs={8} className={"mt-2"}>
                    <h4 className={"text-center"}>Admins</h4>
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        className={"mb-3"}
                        disablePortal
                        disableCloseOnSelect
                        options={adminsList}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        filterOptions={(options) => {
                            return options.filter(responder => {
                                if (card === null || card.length === 0) return true;
                                return card.every(card => card.email !== responder.email);
                            });
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Set Admins..." />}
                        onChange={(_event, value, reason) => {
                            if(reason === "selectOption") {
                                APIDropDownToDB(
                                    value.imageUrl, value.label, value.email
                                );
                            }
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {card ?
                    card.map((card, index) => (
                        <Grid item key={index} xs={4}>
                            <Box px={1} pb={1}>
                                <Card key={index}>
                                    <Card.Body className={"text-center"}>
                                        <Card.Text className={"text-end"}><CloseButton onClick={() => deleteAdmins(card._id)}/></Card.Text>
                                        <Avatar
                                            sx={{ bgcolor: "orange",
                                                mx:"auto",
                                                display:"block"
                                            }}
                                            alt={card.name}
                                            src={card.image}
                                        />
                                        <Card.Text>
                                            {card ? card.name : null}
                                        </Card.Text>
                                        <Card.Text>
                                            {card ? card.email : null}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Box>
                        </Grid>
                    ))
                    : null
                }
            </Grid>
        </>
    );
}

export default Admins;
