import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import { azureConnection } from "../../index";
import NavBarHeader from "../NavBar";

import SidebarTeams from "./SidebarTeams";
import Tickets from "./Tickets";

function User() {
    const [projectList, setPrjList] = useState(null);
    const [teamVal, setTeamVal] = useState(null);

    /*when team val change is called and teamval is altered, run azure calls, which renders tickets based on projects*/
    useEffect(() => {
        initRun();
    }, []);

    async function initRun() {
        const prjs = await azureConnection.getProjects();
        const teams = await azureConnection.getTeams();
        console.log(prjs);
        console.log(teams);
        setPrjList(prjs);
        setTeamVal([teams.value[0].projectId, teams.value[0].id]);
    }

    async function prjTickets (prjID) {
        console.log(prjID);
        const teams = await azureConnection.getTeams(prjID);
        setTeamVal([prjID, teams.value[0].id]);
    }

    return(
        <>
            <NavBarHeader />
            <Row>
                <Col xs={5} sm={4} md={3} id="sidebar">
                    <Container className="d-flex flex-column justify-content-center ">

                        {projectList ?
                            projectList.value.map((thisPrj, index) => (
                                <div key={index} onClick={() => prjTickets(thisPrj.id)} className={"projectSelect"}>
                                    <Card className={teamVal[0] === thisPrj.id ? "mt-3 activeProjectCard shadow-lg" : "mt-3 shadow-sm"}>
                                        <Card.Title className={"ms-2 mt-2"}>
                                            {thisPrj.name}
                                        </Card.Title>
                                        <Card.Body>
                                            <h6><u>Teams</u></h6>
                                            <SidebarTeams thisTeam={thisPrj.id} />
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                            : null}
                    </Container>
                </Col>
                <Col xs={8} sm={7} md={9}>
                    <div className={"ms-1"}>
                        <Row>
                            <Tickets projects={teamVal} key={teamVal} />
                        </Row>
                    </div>
                </Col>

            </Row>
        </>
    );
}

export default User;
