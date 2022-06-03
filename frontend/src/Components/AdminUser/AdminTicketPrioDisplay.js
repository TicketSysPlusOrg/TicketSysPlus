import React, {useEffect, useState} from "react";
import {Container} from "react-bootstrap";
import {azureConnection} from "../../index";
import PrioList from "./PrioList";

function AdminPrio(props) {
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

    return (
        <>
            <Container style={{width: "100%"}}>
                {teamVal ? <PrioList key={teamVal} projects={teamVal} /> : null}
            </Container>
        </>
    );

}

export default AdminPrio;
