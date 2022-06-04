import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {azureConnection} from "../../index";

function AutoCompleteNames() {
    const [teamMembersList, setTeamMembersList] = useState([]);

    useEffect(() => {
        (async () => {
            const projects = await azureConnection.getProjects();
            const allTeamMembers = await azureConnection.getAllTeamMembers(projects.value[1].id);
            setTeamMembersList(allTeamMembers.value);
        })();
    }, []);

    useEffect(() => {
        console.log(teamMembersList);
    }, [teamMembersList]);


    return (
        <>
            {teamMembersList ?
                <Autocomplete
                    id={"nameChoices"}
                    options={teamMembersList.identity.displayName}
                    renderInput={ params => (
                        <TextField {...params} label={"nameChoices"} variant={"outlined"} />
                        /*getOptionLabel={option => option.name}*/
                        /*style={{width: 270}}*/
                    )}
                />
                : <p>Loading team members...</p>}

        </>
    );
}

export default AutoCompleteNames;
