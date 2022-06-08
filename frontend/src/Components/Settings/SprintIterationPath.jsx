import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid } from "@mui/material";

import { getSettings } from "../../utils/Util";
import { backendApi } from "../../index";
import { azureConnection } from "../../index";

function SprintIterationPath(props) {
    const [iterationPaths, setIterationPaths] = useState([]);
    const [iterationPath, setIterationPath] = useState("");
    const [mainProject, setMainProject] = useState("");

    useEffect(() => {
        (async () => {
            const temp = "MotorQ Project";

            backendApi.get("/settings")
                .then((res) => {
                    if (res.data[0] !== undefined) {
                        let { body } = res.data[0];
                        body = JSON.parse(body);
                        if (body.mainProject !== undefined) {
                            setMainProject(body.mainProject);
                        }
                        console.log(iterationPath);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            azureConnection.getIterations(temp)
                .then(object => {
                    console.log(object);
                    setIterationPaths(object.value.map(iteration => {
                        return iteration.path;
                    }));
                    backendApi.get("/settings")
                        .then((res) => {
                            if (res.data[0] !== undefined) {
                                let { body } = res.data[0];
                                body = JSON.parse(body);
                                if ( body.iterationPath !== undefined ) {
                                    setIterationPath(body.iterationPath);
                                }
                                console.log(iterationPath);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
        })();
    }, []);

    return (
        <>
            <Grid container className={"mt-4"}>
                <Grid item xs={8} className={"mt-2"}>
                    <h4 className={"text-center"}>Sprint Iteration Path</h4>
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        className={"mb-3"}
                        disablePortal
                        value={iterationPath}
                        disableCloseOnSelect
                        options={iterationPaths}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Set Iteration Path..." />}
                        onChange={async (_event, value, reason) => {
                            if(reason === "selectOption") {
                                const changes = {
                                    "iterationPath": value
                                };

                                setIterationPath(value);

                                const settings = await getSettings();
                                const body = (settings !== undefined && settings.length > 0 ? JSON.parse(settings[0].body) : {});
                                backendApi.delete("settings")
                                    .then((res) => {
                                        console.log(res);
                                        backendApi.post("settings", {
                                            body: JSON.stringify({ ...body, ...changes })
                                        })
                                            .then((res) => {
                                                console.log(res);
                            
                                            })
                                            .catch((err) => {
                                                console.log(err);
                                            });                    
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default SprintIterationPath;
