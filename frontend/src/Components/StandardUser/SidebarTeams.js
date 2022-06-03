import React, {useEffect, useState} from "react";
import {azureConnection} from "../../index";
import {Container} from "react-bootstrap";

function SidebarTeams(props) {
    const [teamList, setTeamList] = useState(null);

    /*get teams associated with project*/
    useEffect(() => {
        (async () => {
            const teams = await azureConnection.getTeam(props.thisTeam);
            setTeamList(teams);
        })();
    }, []);

    /*send updated project val + team ID val to parent*/
    // function teamValChange(event) {
    //     const splitThis = event.target.value.split(",");
    //     props.onChange(splitThis);
    // }

    return (
        <>
            {teamList ?
                teamList.value.map((thisTeam, index) => (
                    <p key={index} className="m-2 mt-3">{teamList ? thisTeam.name : "Loading..."}</p>
                )) :
                <Container>
                    <p>Loading Teams...</p>
                </Container>}

        </>
    );
}

export default SidebarTeams;
