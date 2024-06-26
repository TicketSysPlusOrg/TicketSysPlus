import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid } from "@mui/material";

import { getSettings } from "../../utils/Util";
import { backendApi } from "../../index";
import { azureConnection } from "../../index";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * This component handles the setting of a default iteration path for ticket creation.
 * @param {props} defaultProject the current selected default project.
 * @param {props} setDefaultProject the new default project.
 * @returns {JSX.Element} SprintIterationPath component.
 */
function SprintIterationPath({ defaultProject, setDefaultProject }) {
    const [iterationPaths, setIterationPaths] = useState([]);
    const [iterationPath, setIterationPath] = useState({ label: "", path: "" });

    useEffect(() => {
        (async () => {
            backendApi.get("/settings")
                .then((res) => {
                    if (res.data[0] !== undefined) {
                        let { body } = res.data[0];
                        body = JSON.parse(body);
                        if (body.defaultProject !== undefined) {
                            setDefaultProject(body.defaultProject);
                        }
                        console.log(defaultProject);
                    }
                })
                .catch(console.error);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (defaultProject !== "") {
                azureConnection.getIterations(defaultProject)
                    .then(object => {
                        console.log(object);
                        setIterationPaths(object.value.map(iteration => {
                            const labelArray = iteration.path.split("\\");
                            return { path: iteration.path, label: labelArray[1] !== undefined ? labelArray[1] : iteration.path };
                        }));
                        backendApi.get("/settings")
                            .then((res) => {
                                if (res.data[0] !== undefined) {
                                    let { body } = res.data[0];
                                    body = JSON.parse(body);
                                    const path = body.iterationPath.split("\\");
                                    if ( body.iterationPath !== undefined && path[0] === defaultProject ) {
                                        setIterationPath({ label: path[1], path: body.iterationPath });
                                    } else {
                                        setIterationPath({ label: "", path: "" });
                                    }
                                }
                            })
                            .catch(console.error);
                    });
            }
        })();
    }, [defaultProject]);

    return (
        <>
            <Grid container className={"mt-4"}>
                <Grid item xs={4} className={"mt-2"}>
                    <h4 className={"text-center"}>Sprint Iteration Path</h4>
                </Grid>
                <Grid item xs={8}>
                    <Autocomplete
                        className={"mb-3"}
                        disablePortal
                        disableClearable
                        value={iterationPath}
                        options={iterationPaths}
                        isOptionEqualToValue={(option, value) => option.label === value.label || option.path.length > 0}
                        sx={{ pr: 4 }}
                        renderInput={(params) => <TextField {...params} label="Set Iteration Path..." />}
                        onChange={async (_event, value, reason) => {
                            if(reason === "selectOption") {
                                const changes = {
                                    "iterationPath": value.path
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
                                            .catch(console.error);
                                    })
                                    .catch(console.error);
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
}

export default SprintIterationPath;
