import React, {useEffect, useState} from "react";
import {azureConnection} from "../../index";
import {Container} from "react-bootstrap";
import SidebarTeams from "./SidebarTeams";

function PrjSideBar() {
    const [projectList, setPrjList] = useState(null);

    useEffect(() => {
        (async () => {
            const prjs = await azureConnection.getProjects();
            setPrjList(prjs);
            console.log(prjs);
        })();
    }, []);

    return (
        <>
            <Container className="d-flex flex-column justify-content-center ">

                {projectList ?
                    projectList.value.map((thisPrj, index) => (
                        <Container key={index}>
                            <h2 className={"mt-2"}>{projectList ? projectList.value[index].name : null}</h2>

                            {projectList ? <SidebarTeams thisTeam={projectList.value[index].id} /> : null}
                        </Container>

                    ))
                    : null}

            </Container>

        </>
    );
}

export default PrjSideBar;
