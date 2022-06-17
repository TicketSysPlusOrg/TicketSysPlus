import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

import { azureConnection } from "../../index";
import { getSettings, arrayMove } from "../../utils/Util";
import NavBar from "../NavBar";

import Legend from "./Legend";
import Tickets from "./Tickets";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * Main tickets page component. Calls sidebar projects and main tickets content, as well as navbar.
 * @returns {JSX.Element} User component
 */
function User() {
    const [projectList, setPrjList] = useState(null);
    const [prjVal, setPrjVal] = useState(null);
    const [iterationPath, setIterationPath] = useState("");

    /*when prj val change is called and prjVal is altered, run azure calls, which renders tickets based on projects. also runs for initial page render*/
    useEffect(() => {
        initRun();
    }, []);

    async function initRun() {
        const settings = await getSettings();

        /*set default project and iteration path per admin settings panel*/
        let defaultProject = "";
        if (prjVal === null) {
            if (settings !== undefined && settings.length > 0) {
                const settingsObj = JSON.parse(settings[0].body);
                defaultProject = settingsObj.defaultProject;
                setIterationPath(settingsObj.iterationPath);
            }
        }

        const prjs = await azureConnection.getProjects();
        let projectIndex = null;
        const defaultProj = prjs.value.filter((prj, index) => {
            if (prj.name === defaultProject) {
                projectIndex = index;
                return true;
            }
            return false;
        })[0];

        if (defaultProj !== undefined && projectIndex !== null) {
            arrayMove(prjs.value, projectIndex, 0);
        }

        setPrjVal([defaultProj !== undefined ? defaultProj.id : prjs.value[0].id]);
        setPrjList(prjs);
    }

    async function prjTickets(prjID) {
        const teams = await azureConnection.getTeams(prjID);
        setPrjVal([prjID, undefined]);
    }

    /*child changes to show trigger tickets rerender. needed for rerender after ticket creation*/
    const [show, setShow] = useState(false);

    /*triggers a ticket page rerender on state change*/
    const[rerender, setRerender] = useState(false);
    useEffect(() => {
        if(!show) {
            rerender === false ? setRerender(true) : setRerender(false);
        }
    }, [show]);

    return(
        <>
            <NavBar show={show} setShow={setShow} iterationPath={iterationPath} />
            <Container fluid>
                <Row id={"vhscroll"}>
                    <Col xs={2} id="sidebar " className={"bg-light"}>
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
                            <Tickets show={show} setShow={setShow} projects={prjVal} key={prjVal} rerender={rerender} setPrjVal={setPrjVal} iterationPath={iterationPath} />
                        </Row>
                    </Col>
                </Row>
            </Container>

        </>
    );
}

export default User;
