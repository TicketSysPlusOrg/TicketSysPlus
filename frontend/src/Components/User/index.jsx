import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import { azureConnection } from "../../index";
import NavBarHeader from "../NavBar";

import Legend from "./Legend";
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
            <Container fluid>
                <Row id={"vhscroll"}>
                    <Col xs={2} id="sidebar " className={"bg-light vhscroll"}>
                        <Container className="d-flex flex-column justify-content-center ">

                            {projectList ?
                                projectList.value.map((thisPrj, index) => (
                                    <div key={index} onClick={() => prjTickets(thisPrj.id)} className={"projectSelect"}>
                                        <Card className={teamVal[0] === thisPrj.id ? "mt-3 activeProjectCard shadow-lg" : "mt-3 shadow-sm"}>
                                            <Card.Title className={"ms-2 mt-2"}>
                                                {thisPrj.name}
                                            </Card.Title>
                                        </Card>
                                    </div>
                                ))
                                : null}
                            
                            <Legend />
                        </Container>
                    </Col>
                    <Col xs={10} id={"inset-shadow"} className={"colscrolls"}>
                        <Row className={"ps-4"}>
                            <Tickets projects={teamVal} key={teamVal} />
                        </Row>
                    </Col>
                </Row>
            </Container>

        </>
    );
}

export default User;
