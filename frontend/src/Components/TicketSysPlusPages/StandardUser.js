import React, {useState, useEffect} from "react";

import NavBarHeader from "../NavBarHeader";
import UserTickets from "../StandardUser/userTickets";
import {Card, Col, Container, Row} from "react-bootstrap";
import SidebarTeams from "../StandardUser/SidebarTeams";
import {azureConnection} from "../../index";

function StandardUser(props) {
    const [projectList, setPrjList] = useState(null);
    const [teamVal, setTeamVal] = useState(null);

    function teamValChange(newSortingTeam) {
        setTeamVal(newSortingTeam);
    }

    /*when team val change is called and teamval is altered, run azure calls, which should (once we have a method to do so) render tickets based on teams (or diff projects once we get that far)*/
    useEffect(() => {
        run();
    }, []);

    async function run() {
        const prjs = await azureConnection.getProjects();
        const teams = await azureConnection.getTeams(prjs.value[0].id);
        setPrjList(prjs);
        setTeamVal([teams.value[0].projectId, teams.value[0].id]);
    }

    return(
        <>
            <NavBarHeader />
            <Row>
                <Col xs={5} sm={4} md={3} id="sidebar">
                    <Container className="d-flex flex-column justify-content-center ">
                        {projectList ?
                            projectList.value.map((thisPrj, index) => (
                                <Card key={index} className="mt-3 shadow-lg">
                                    <Card.Title className="ms-2 mt-2">
                                        {thisPrj ? thisPrj.name : "Loading..."}
                                    </Card.Title>
                                    <Card.Body>
                                        <h5><u>Teams</u></h5>
                                        {thisPrj ?
                                            <SidebarTeams thisTeam={thisPrj.id} value={teamVal} onChange={teamValChange}/>
                                            : "Loading..."}
                                    </Card.Body>
                                </Card>
                            ))
                            : null}
                    </Container>
                </Col>
                <Col xs={6} sm={7} md={8}>
                    <Container>
                        <Row>
                            {teamVal ? <UserTickets key={teamVal} projects={teamVal} /> : null}
                        </Row>
                    </Container>
                </Col>

            </Row>
        </>
    );
}

export default StandardUser;
