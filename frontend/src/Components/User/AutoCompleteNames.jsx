import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";

import { autocompleteClasses } from "@mui/material/Autocomplete";
import { azureConnection } from "../../index";

function AutoCompleteNames({setMentionChoices}) {
    const [teamMembersList, setTeamMembersList] = useState([]);
    const [teamMembers, setTeamMembers] = useState(null);
    const [chooseList, setChooseList] = useState([]);

    useEffect(() => {
        (async () => {
            const projects = await azureConnection.getProjects();
            const allTeamMembers = await azureConnection.getAllTeamMembers(projects.value[1].id);
            setTeamMembersList(allTeamMembers);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            let mappedTeamMembers = teamMembersList.value.map((teamMember) => {
                return { label: teamMember.identity.displayName, email: teamMember.identity.uniqueName, id: teamMember.identity.id };
            });
            setTeamMembers(mappedTeamMembers);
        })();
    }, [teamMembersList]);

    useEffect(() => {
        setMentionChoices(chooseList);
    }, [chooseList]);

    return (
        <>
            {teamMembers !== null ?
                <Autocomplete
                    id={"nameChoices"}
                    multiple
                    disablePortal
                    disableCloseOnSelect
                    options={teamMembers}
                    sx={{ borderRadius: "0.375rem"  }}
                    renderInput={ params => (
                        <TextField {...params} label={"team members"} variant={"outlined"} />
                    )}
                    onChange={(_event, value, reason) => {
                        if(reason === "selectOption" || reason === "removeOption") {
                            setChooseList(value);
                        }
                    }}
                />
                : <p>Loading team members...</p>}

        </>
    );
}

export default AutoCompleteNames;
