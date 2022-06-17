import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import PropTypes from "prop-types";

import { azureConnection, backendApi } from "../../index";


/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * This component handles autocompletion of organization members for assigning people to a ticket
 * or mentioning them. It automatically mentions anyone assigned as an on call responder.
 * @param {props} index number used to differentiate between single or multiple version of autocomplete.
 * @param setMentionChoices state setter from parent for multi choice mentions list.
 * @param setAssignee state setter from parent for single choice assignee.
 * @returns {JSX.Element} AutoCompleteNames component.
 */
function AutoCompleteNames({ index, setMentionChoices, setAssignee }) {
    const [teamMembersList, setTeamMembersList] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

    /*chooselist is used for the parent component's 'mentions'*/
    const [chooseList, setChooseList] = useState([]);
    /*assigned is used for the parent component's 'assigned to'*/
    const [assigned, setAssigned] = useState(null);

    /*on call members to auto select*/
    const [onCallMembers, setOnCallMembers] = useState([]);

    /*DevOps calls on render for retrieving data and setting to states*/
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

    /*auto setting on call members for dynamically setting mentions*/
    useEffect(() => {
        setChooseList(onCallMembers);
    }, [onCallMembers]);

    /*setting all possible choices for mentions*/
    useEffect(() => {
        setMentionChoices(chooseList);
    }, [chooseList]);

    /*setting assignee for use in parent*/
    useEffect(() => {
        setAssignee(assigned);
    }, [assigned]);

    /*two render options - one for single-choice assignee of a ticket, other for ticket mentions*/
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
