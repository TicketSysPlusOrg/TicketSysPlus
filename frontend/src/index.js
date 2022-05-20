import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import App from './Components/App';
import AppPages from "./AppPages";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// MSAL imports
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig, azureConfig } from "./authConfig";

import { AzureDevOpsApi } from "./azure-devops-api";
import {forEach} from "react-bootstrap/ElementChildren";

export const azureConnection = new AzureDevOpsApi(azureConfig.organizationUrl, azureConfig.token);

// TODO: Example Function. Used to showcase how to use the custom Azure DevOps API
async function run() {
    const teams = await azureConnection.getTeams();
    console.log(teams);

    const projects = await azureConnection.getProjects();
    console.log(projects);

    if ((projects.count !== undefined && projects.count > 0) && (projects.count !== undefined && teams.count > 0)) {
        const workItems = await azureConnection.getTasks(projects.value[0].id, teams.value[0].id);
        console.log(workItems);
    }

    const allWorkItems = await azureConnection.getAllTasks(projects.value[0].id, teams.value[0].id);
    console.log(allWorkItems);

    let listOfIds = [];
    for (let i = 0; i < allWorkItems.workItems.length; i++) {
        listOfIds += allWorkItems.workItems[i].id + ",";
        // listOfIds.push(allWorkItems.workItems[i].id);
    }
    listOfIds = listOfIds.substring(0, listOfIds.length -1);
    console.log("formatted ids? " + listOfIds);

    const workItemsById = await azureConnection.getWorkTicketByID(projects.value[0].id, teams.value[0].id, allWorkItems.workItems[0].id);
    console.log(workItemsById);

    const singleTicket = await azureConnection.getOneTicket(projects.value[0].id, allWorkItems.workItems[0].id);
    console.log(singleTicket);

    const ticketBatch = await azureConnection.getTicketBatch(projects.value[0].id, listOfIds);
    console.log(ticketBatch);
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
        <AppPages pca={msalInstance} login={true} />
    </BrowserRouter>

);
