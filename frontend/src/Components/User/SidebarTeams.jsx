import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import PropTypes from "prop-types";

import { azureConnection } from "../../index";


function SidebarTeams({ thisTeam }) {
    const [teamList, setTeamList] = useState(null);

    /*get teams associated with project*/
    useEffect(() => {
        (async () => {
            const teams = await azureConnection.getTeam(thisTeam);
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

SidebarTeams.propTypes = {
    thisTeam: PropTypes.string
};

export default SidebarTeams;
