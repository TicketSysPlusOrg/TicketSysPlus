import React, {useEffect, useState} from "react";
import { useAutocomplete } from '@mui/base/AutocompleteUnstyled';
import { styled } from '@mui/material/styles';
import { autocompleteClasses } from '@mui/material/Autocomplete';
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
            {/*{teamMembersList ?*/}
            {/*    <Autocomplete*/}
            {/*        id={"nameChoices"}*/}
            {/*        options={teamMembersList.identity.displayName}*/}
            {/*        renderInput={ params => (*/}
            {/*            <TextField {...params} label={"nameChoices"} variant={"outlined"} />*/}
            {/*        )}*/}
            {/*    />*/}
            {/*    : <p>Loading team members...</p>}*/}
            <p>nothing yet</p>

        </>
    );
}

export default AutoCompleteNames;
