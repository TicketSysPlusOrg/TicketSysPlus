import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Box, Container, Paper, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";

import { backendApi } from "../../index";
import { loginRequest } from "../../authConfig";
import NavBar from "../NavBar";

import Admins from "./Admins";
import SprintIterationPath from "./SprintIterationPath";
import DefaultProject from "./DefaultProject";

/*
    {
        iterationPath: "",
        mainProject: ""
    }
*/

/*
    [
        {
            image: "",
            name: "",
            email: ""
        }
    ]
*/

function Settings() {
    const authRequest = {
        ...loginRequest
    };

    useEffect(() => {
        // backendApi.get("");
    }, []);

    const [show, setShow] = useState(false);

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            <NavBar show={show} setShow={setShow} />
            <Container>
                <Box sx={{ marginTop: "10vh", height: "83vh" }}>
                    <Stack spacing={2}>
                        <Paper elevation={3}><DefaultProject /></Paper>
                        <Paper elevation={3}><SprintIterationPath /></Paper>
                        <Paper elevation={3}><Admins /></Paper>
                    </Stack>
                </Box>
            </Container>
        </MsalAuthenticationTemplate>
    );
}

export default Settings;
