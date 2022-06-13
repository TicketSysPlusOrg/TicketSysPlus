import React, { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

import {azureConnection, backendApi} from "../../index";


/*
 * INDEX: number used to differentiate between single or multiple version of autocomplete
 * SETMENTIONCHOICES: state setter from parent for multi choice mentions list
 * SETASSIGNEE: state setter from parent for single choice assignee
 */
function AutoCompleteNames({ index, setMentionChoices, setAssignee }) {
    const [teamMembersList, setTeamMembersList] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

    /*chooselist is used for the parent component's 'mentions'*/
    const [chooseList, setChooseList] = useState([]);
    /*assigned is used for the parent component's 'assigned to'*/
    const [assigned, setAssigned] = useState(null);

    /*oncall members to auto select*/
    const [onCallMembers, setOnCallMembers] = useState([]);

    useEffect(() => {
        (async () => {
            const projects = await azureConnection.getProjects();
            const allTeamMembers = await azureConnection.getAllTeamMembers(projects.value[1].id);
            await setTeamMembersList(allTeamMembers);
            let mappedTeamMembers = allTeamMembers.value.map((teamMember) => {
                return { "label": teamMember.identity.displayName, "email": teamMember.identity.uniqueName, "id": teamMember.identity.id };
            });
            setTeamMembers(mappedTeamMembers);
            if (index === 2) {
                await backendApi.get("responders")
                    .then((res) => {
                        let mappedOnCallMember = res.data.map((onCallMember) => {
                            return { "label": onCallMember.name, "email": onCallMember.email, "id": onCallMember._id };
                        });
                        setOnCallMembers(mappedOnCallMember);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })();
    }, []);

    useEffect(() => {
        setChooseList(onCallMembers);
    }, [onCallMembers]);

    useEffect(() => {
        setMentionChoices(chooseList);
    }, [chooseList]);

    /*setting assignee for use in parent*/
    useEffect(() => {
        setAssignee(assigned);
    }, [assigned]);

    /*value={onCallMembers ? onCallMembers.map((eachMember) => eachMember) : null}*/
    return (
        <>
            {teamMembers !== null ?
                index === 2 && chooseList ?
                    <Autocomplete
                        index={index}
                        multiple
                        disablePortal
                        filterSelectedOptions
                        options={teamMembers}
                        sx={{ borderRadius: "0.375rem"  }}
                        renderInput={ params => (
                            <TextField {...params} label={"team members"} variant={"outlined"} />
                        )}
                        onChange={(_event, value) => {
                            setChooseList(value);
                        }}
                        isOptionEqualToValue={(option, value) => option?.email === value?.email}
                        value={chooseList}
                    />
                    :
                    <Autocomplete
                        index={index}
                        disablePortal
                        filterSelectedOptions
                        options={teamMembers}
                        sx={{ borderRadius: "0.375rem"  }}
                        renderInput={ params => (
                            <TextField {...params} label={"responsible party"} variant={"outlined"} />
                        )}
                        onChange={(_event, value) => {
                            setAssigned(value);
                        }}
                    />
                : <p>Loading team members...</p>}

        </>
    );
}

AutoCompleteNames.propTypes = {
    key: PropTypes.number,
    setMentionChoices: PropTypes.func,
    setAssignee: PropTypes.func
};

export default AutoCompleteNames;
