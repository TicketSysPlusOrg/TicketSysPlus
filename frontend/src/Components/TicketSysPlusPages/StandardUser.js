import React, {useState, useEffect} from "react";

import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../../authConfig";

import { ErrorComponent } from "./ErrorComponent";
import { Loading } from "./Loading";

import NavBarHeader from "../NavBarHeader";
import UserTickets from "../StandardUser/userTickets";
import {Col, Container, Row} from "react-bootstrap";
import SidebarTeams from "../StandardUser/SidebarTeams";
import {azureConnection} from "../../index";

function StandardUser(props) {
    const authRequest = {
        ...loginRequest
    };

    const [projectList, setPrjList] = useState(null);
    const [teamVal, setTeamVal] = useState(null);

    function teamValChange(newSortingTeam) {
        setTeamVal(newSortingTeam.split(","));
        console.log(teamVal);
    }

    useEffect(() => {
        (async () => {
            const prjs = await azureConnection.getProjects();
            const teams = await azureConnection.getTeams();
            setPrjList(prjs);
            setTeamVal(teams.value[0].id, teams.value[0].projectId);
        })();
    }, []);

    return(
        <MsalAuthenticationTemplate
            interactionType={InteractionType.Redirect} 
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent} 
            loadingComponent={Loading}
        >
            <NavBarHeader />
            <Row>
                <Col xs={3} id="sidebar">
                    <Container className="d-flex flex-column justify-content-center ">
                        {projectList ?
                            projectList.value.map((thisPrj, index) => (
                                <Container key={index}>
                                    <h2 className={"mt-2"}>{projectList ? projectList.value[index].name : null}</h2>

                                    {projectList ? <SidebarTeams thisTeam={projectList.value[index].id} value={teamVal} onChange={teamValChange}/> : null}
                                </Container>

                            ))
                            : null}
                    </Container>
                </Col>
                <Col xs={8}>
                    <Container>
                        <Row>
                            {teamVal ? <UserTickets projects={teamVal} onChange={teamVal}/> : null}
                        </Row>
                    </Container>
                </Col>

            </Row>

        </MsalAuthenticationTemplate >
    );
}

export default StandardUser;
