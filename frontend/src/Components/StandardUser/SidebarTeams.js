import React, {useEffect, useState, Suspense} from "react";
import {azureConnection} from "../../index";
import {Card} from "react-bootstrap";

function SidebarTeams(props) {
    const [teamList, setTeamList] = useState(null);

    useEffect(() => {
        (async () => {
            const teams = await azureConnection.getTeam(props.thisTeam);
            setTeamList(teams);
            console.log(teams);
        })();
    }, []);

    return (
        <>
            {teamList ?
                teamList.value.map((thisTeam, index) => (
                            <Card key={index} className="card m-2 mt-3 shadow-lg">
                                <Card.Title className="card-title ms-2">
                                    {teamList ? teamList.value[index].name : "Loading..."}
                                </Card.Title>
                                <Card.Body className="card-body">
                                    {teamList ? teamList.value[index].description : "Loading..."}
                                </Card.Body>
                            </Card>
                        )
                    )
                : null}

        </>
    );
}

export default SidebarTeams;
