import React, {useState, useEffect} from "react";
import NavBarHeader from "../NavBarHeader";
import UserTickets from "../StandardUser/userTickets";
import {Card, Col, Container, Row} from "react-bootstrap";
import SidebarTeams from "../StandardUser/SidebarTeams";
import {azureConnection} from "../../index";

function StandardUser() {
    const [projectList, setPrjList] = useState(null);
    const [teamVal, setTeamVal] = useState(null);

    /*when team val change is called and teamval is altered, run azure calls, which should (once we have a method to do so) render tickets based on teams (or diff projects once we get that far)*/
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
                    <h6 className={"text-center mt-3"}><u>Select a Project</u></h6>
                    <Container className="d-flex flex-column justify-content-center ">

                        {projectList ?
                            projectList.value.map((thisPrj, index) => (
                                <div key={index} onClick={() => prjTickets(thisPrj.id)} className={"projectSelect"}>
                                    <Card className={teamVal[0] === thisPrj.id ? "mt-3 activeProjectCard shadow-lg" : "mt-3 shadow-sm"}>
                                        <Card.Title className={"ms-2 mt-2"}>
                                            {thisPrj ? thisPrj.name : "Loading..."}
                                        </Card.Title>
                                        <Card.Body>
                                            <h6><u>Teams</u></h6>
                                            {thisPrj ?
                                                <SidebarTeams thisTeam={thisPrj.id} />
                                                : "Loading..."}

                                        </Card.Body>
                                    </Card>
                                </div>
                            ))
                            : null}
                    </Container>
                </Col>
                <Col xs={8} sm={7} md={9}>
                    <Container>
                        <Row>
                            {teamVal ? <UserTickets projects={teamVal} key={teamVal}/> : null}
                        </Row>
                    </Container>
                </Col>

            </Row>
        </>
    );
}

export default StandardUser;
