import React, {useEffect, useState, Suspense} from "react";
import {azureConnection} from "../../index";
import {Card, Container} from "react-bootstrap";

function PrjSideBar() {

    const [teamList, setTeamList] = useState(null);

    useEffect(() => {
        async function run() {
            const teams = await azureConnection.getTeams();
            setTeamList(teams);
            console.log(teams);
        }
        run();
    }, [])

    return (
        <>
            <Container className="d-flex flex-column justify-content-center ">

{/*                <Suspense fallback={"Loading data..."}>
                    {teamList.value.map((thisTeam, index) => (
                            <Card key={index} className="card m-2 mt-3 shadow-lg">
                                <Card.Title className="card-title ms-2">
                                    {teamList ? teamList.value[index].name : "Loading..."}
                                </Card.Title>
                                <Card.Body className="card-body">
                                    {teamList ? teamList.value[index].description : "Loading..."}
                                </Card.Body>
                            </Card>
                        )
                    )}
                </Suspense>*/}

                <Card className="m-2 shadow-lg">
                    <Card.Title className="m-2">
                        {teamList ? teamList.value[0].name : "Loading..."}
                    </Card.Title>
                    <Card.Body className="">
                        {teamList ? teamList.value[0].description : "Loading..."}
                    </Card.Body>
                </Card>
                <div className="card m-2 shadow-lg">
                    <div className="card-title ms-2">
                        Project 3
                    </div>
                    <div className="card-body">

                    </div>
                </div>
                <div className="card m-2 shadow-lg">
                    <div className="card-title ms-2">
                        Project 4
                    </div>
                    <div className="card-body">

                    </div>
                </div>
                <div className="card m-2 shadow-lg">
                    <div className="card-title ms-2">
                        Project 5
                    </div>
                    <div className="card-body">

                    </div>
                </div>
            </Container>

        </>
    );
}

export default PrjSideBar;
