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

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * This component calls the admin settings components used for ticket creation handling
 * (namely default project and sprint) and setting current administrators.
 * @returns {JSX.Element} Settings component.
 */
function Settings() {
    const authRequest = {
        ...loginRequest
    };

    const [show, setShow] = useState(false);

    const [defaultProject, setDefaultProject] = useState("");

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect}
            authenticationRequest={authRequest}
        >
            <div id={"settingsComponent"}>
                <NavBar show={show} setShow={setShow} />
                <Container>
                    <Box sx={{ marginTop: "10vh", height: "83vh" }}>
                        <Stack spacing={2}>
                            <Paper elevation={3}><DefaultProject defaultProject={defaultProject} setDefaultProject={setDefaultProject} /></Paper>
                            <Paper elevation={3}><SprintIterationPath defaultProject={defaultProject} setDefaultProject={setDefaultProject} /></Paper>
                            <Paper elevation={3}><Admins /></Paper>
                        </Stack>
                    </Box>
                </Container>
            </div>
        </MsalAuthenticationTemplate>
    );
}

export default Settings;
