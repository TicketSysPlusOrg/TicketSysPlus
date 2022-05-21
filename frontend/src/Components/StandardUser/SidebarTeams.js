import React, {useEffect, useState} from "react";
import {azureConnection} from "../../index";
import {Button, Card} from "react-bootstrap";

function SidebarTeams(props) {
    const [teamList, setTeamList] = useState(null);

    useEffect(() => {
        (async () => {
            const teams = await azureConnection.getTeam(props.thisTeam);
            setTeamList(teams);
        })();
    }, []);

    function teamValChange(event) {
        props.onChange(event.target.value);
    }

    return (
        <>
            {teamList ?
                teamList.value.map((thisTeam, index) => (
                    <Card key={index} className="card m-2 mt-3 shadow-lg">
                        <Card.Title className="card-title ms-2">
                            {teamList ? teamList.value[index].name : "Loading..."}
                        </Card.Title>
                        <Card.Body className="card-body">
                            {teamList ?
                                teamList.value[index].description : "Loading..."}
                            <Button onClick={teamValChange} size={"sm"} className={"float-end"}
                                    value={teamList ? [teamList.value[index].projectId, teamList.value[index].id] : null}
                            >See Team Tickets</Button>
                        </Card.Body>
                    </Card>
                )) : null}

        </>
    );
}

export default SidebarTeams;
