import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppPages from "./AppPages";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// MSAL imports
import { PublicClientApplication, EventType } from "@azure/msal-browser";
import { msalConfig, azureConfig } from "./authConfig";

import { AzureDevOpsApi } from "./azure-devops-api";

export const azureConnection = new AzureDevOpsApi(azureConfig.organizationUrl, azureConfig.token);

// TODO: Example Function. Used to showcase how to use the custom Azure DevOps API
async function run() {
    const teams = await azureConnection.getTeams();
    console.log(teams);

    const projects = await azureConnection.getProjects();
    console.log(projects);

    if ((projects.count !== undefined && projects.count > 0) && (projects.count !== undefined && teams.count > 0)) {
        const workItems = await azureConnection.getWorkItemTasks(projects.value[0].id, teams.value[0].id);
        console.log(workItems);
    }

    const allWorkItems = await azureConnection.getAllWorkItems(projects.value[0].id, teams.value[0].id);
    console.log(allWorkItems);

    const listOfIds = allWorkItems.workItems.map(workItem => workItem.id);
    console.log("Array of IDs: " + listOfIds);

    const singleTicket = await azureConnection.getWorkItem(projects.value[0].id, allWorkItems.workItems[0].id);
    console.log(singleTicket);

    const ticketBatch = await azureConnection.getWorkItems(projects.value[0].id, listOfIds);
    console.log(ticketBatch);

    //TODO: get create working. something is invalid here.

    const getTickTypes = await azureConnection.getWorkItemTypes(projects.value[0].id);
    console.log(getTickTypes);

    const createTicket = await azureConnection.createWorkItem(projects.value[0].id, "Task");
    console.log(createTicket);
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
