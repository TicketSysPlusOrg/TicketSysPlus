import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Box, Container, Paper, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";

import { backendApi } from "../../index";
import { loginRequest } from "../../authConfig";
import NavBar from "../NavBar";

import Admins from "./Admins";

/*
    {
        iterationPath: ""
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

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            <NavBar />
            <Container>
                <Box sx={{ marginTop: "10vh", height: "83vh" }}>
                    <Stack spacing={2}>
                        <Paper elevation={3}>Config 1</Paper>
                        <Paper elevation={3}>Config 2</Paper>
                        <Paper elevation={3}><Admins /></Paper>
                    </Stack>
                </Box>
            </Container>
        </MsalAuthenticationTemplate>
    );
}

export default Settings;
