import React, {useContext, useEffect, useState} from "react";
import {azureConnection} from "../../index";
import {Container} from "react-bootstrap";
import SidebarTeams from "./SidebarTeams";
import {Context} from "../../AppPages";

function PrjSideBar() {
    const [projectList, setPrjList] = useState(null);
    //TODO: finish useContext data path
    const [context, setContext] = useContext(Context);

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
