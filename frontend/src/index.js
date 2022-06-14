import { EventType, PublicClientApplication } from "@azure/msal-browser";
// eslint-disable-next-line
import { MsalProvider } from "@azure/msal-react";
// eslint-disable-next-line
import axios from "axios";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { azureConfig, msalConfig } from "./authConfig";
import { AzureDevOpsApi } from "./utils/AzureDevOpsApi";

export const azureConnection = new AzureDevOpsApi(azureConfig.organizationUrl, azureConfig.token);

export const backendApi = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        common: {
            "Content-Type": "application/json"
        }
    },
});

// TODO: Example Function. Used to showcase how to use the custom Azure DevOps API
async function run() {
    const teams = await azureConnection.getTeams();
    console.log(teams);

    const projects = await azureConnection.getProjects();
    console.log(projects);

    if ((projects.count !== undefined && projects.count > 0) && (projects.count !== undefined && teams.count > 0)) {
        const workItems = await azureConnection.getWorkItemTasks(teams.value[0].projectId, teams.value[0].id);
        console.log(workItems);
    }

    const allWorkItems = await azureConnection.getAllWorkItems(teams.value[0].projectId, teams.value[0].id);
    console.log(allWorkItems);

    const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
    console.log("Array of IDs: " + listOfIds);


    const singleTicket = await azureConnection.getWorkItem(projects.value[1].id, allWorkItems.workItems[0].id);
    console.log(singleTicket);

    const ticketBatch = await azureConnection.getWorkItems(projects.value[1].id, listOfIds);
    console.log(ticketBatch);

    const teamMembers = await azureConnection.getTeamMembers(teams.value[1].projectId, teams.value[1].id);
    console.log(teamMembers);

    const allTeamMembers = await azureConnection.getAllTeamMembers(projects.value[1].id);
    console.log(allTeamMembers);

    /*const addComment = await azureConnection.addWorkItemComment(projects.value[1].id, 1, "New comment here.");
    console.log(addComment);*/

    /*get project property ID. useful for troubleshooting and setting up the other methods used below to get to work item states */
    /*const getProjProps = await azureConnection.getProjectProperties(projects.value[1].id);
    console.log(getProjProps);*/

    /*TODO: CURRENTLY PRESET TO GET THE INHERITED PROCESS WORK ITEM TYPES. NEED TO LET CUSTOMER KNOW,
        OR SET SOMETHING UP VIA ADMIN PAGE FOR DYNAMIC CHOICE.*/

    /*using all of these methods to get work item states*/
    /*should be four generic ones and one that pavel created*/
    //  const getProcesses = await azureConnection.getProcessesList();
    //  console.log(getProcesses);
    //
    // const getTickTypes = await azureConnection.getWorkItemTypes(getProcesses.value[4].id);
    // console.log(getTickTypes);
    //
    //  const getStates = await azureConnection.getWorkItemStates(getProcesses.value[4].id, getTickTypes.value[0].id)
    //  console.log(getStates);

    //    const thisData = {"fields": {"System.State": "To Do", "System.Title": "A Ticket Title"}};

    //    const createTicket = await azureConnection.createWorkItem(projects.value[0].id, "Task", thisData);
    //    console.log(createTicket);
}
run();

export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    </BrowserRouter>
);
