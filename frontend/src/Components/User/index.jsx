import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import { azureConnection } from "../../index";
import NavBarHeader from "../NavBar";

import Legend from "./Legend";
import Tickets from "./Tickets";

function User() {
    const [projectList, setPrjList] = useState(null);
    const [prjVal, setPrjVal] = useState(null);

    /*when prj val change is called and prjVal is altered, run azure calls, which renders tickets based on projects*/
    useEffect(() => {
        initRun();
    }, []);

    async function initRun() {
        const prjs = await azureConnection.getProjects();
        const teams = await azureConnection.getTeams();
        setPrjList(prjs);
        setPrjVal([teams.value[0].projectId, teams.value[0].id]);
    }

    async function prjTickets(prjID) {
        const teams = await azureConnection.getTeams(prjID);
        setPrjVal([prjID, teams.value[0].id]);
    }

    /*child changes to show trigger tickets rerender. needed for rerender after ticket creation*/
    const [show, setShow] = useState(false);

    const[rerender, setRerender] = useState(false);

    useEffect(() => {
        if(!show) {
            console.log("setshowtoggle");
            rerender === false ? setRerender(true) : setRerender(false);
        }
    }, [show]);

    return(
        <>
            <NavBarHeader show={show} setShow={setShow} />
            <Container fluid>
                <Row id={"vhscroll"}>
                    <Col xs={2} id="sidebar " className={"bg-light vhscroll"}>
                        <Container className="d-flex flex-column justify-content-center ">

                            {projectList ?
                                projectList.value.map((thisPrj, index) => (
                                    <div key={index} onClick={() => prjTickets(thisPrj.id)} className={"projectSelect"}>
                                        <Card className={prjVal[0] === thisPrj.id ? "mt-3 activeProjectCard shadow-lg" : "mt-3 shadow-sm"}>
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
                            <Tickets projects={prjVal} key={prjVal} rerender={rerender} setPrjVal={setPrjVal} />
                        </Row>
                    </Col>
                </Row>
            </Container>

        </>
    );
}

export default User;
