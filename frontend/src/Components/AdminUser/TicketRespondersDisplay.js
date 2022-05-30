import React, {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {azureConnection} from "../../index";
import fetchData from "../APIActions/FetchData";
import "../TicketSysPlusPages/TSPApp.css";
import Responders from "./Responders";

function TicketResponders(props) {
    useEffect(() => {
        run();
    }, []);

    async function run() {
        const teams = await azureConnection.getTeams();
        const projects = await azureConnection.getProjects();
        const membersObject = await azureConnection.getAllTeamMembers(projectId);

        const teamMembers = await azureConnection.getTeamMembers(teams.value[1].projectId, teams.value[1].id);
        console.log(teamMembers);

        const allTeamMembers = await azureConnection.getAllTeamMembers(projects.value[1].id);
        console.log(allTeamMembers);

        const members = membersObject.value.map(member => ({name: member.identity.displayName, icon: member.identity.imageUrl, email: member.identity.uniqueName}));
    }


    return (
        <>

        </>
    );

}

export default TicketResponders;
