import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid } from "@mui/material";

import { getSettings } from "../../utils/Util";
import { backendApi } from "../../index";
import { azureConnection } from "../../index";

function SprintIterationPath(props) {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState("");

    useEffect(() => {
        (async () => {
            azureConnection.getProjects()
                .then(object => {
                    console.log(object);
                    setProjects(object.value.map(project => {
                        return project.name;
                    }));
                });
            backendApi.get("/settings")
                .then(async (res) => {
                    if (res.data[0] !== undefined) {
                        let { body } = res.data[0];
                        body = JSON.parse(body);
                        if ( body.defaultProject !== undefined ) {
                            setProject(body.defaultProject);
                        }
                        console.log(project);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        })();
    }, []);

    return (
        <>
            <Grid container className={"mt-4"}>
                <Grid item xs={8} className={"mt-2"}>
                    <h4 className={"text-center"}>Default Project</h4>
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        className={"mb-3"}
                        disablePortal
                        value={project}
                        disableCloseOnSelect
                        options={projects}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Set Default Project..." />}
                        onChange={async (_event, value, reason) => {
                            if(reason === "selectOption") {
                                const changes = {
                                    "defaultProject": value
                                };

                                setProject(value);

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
