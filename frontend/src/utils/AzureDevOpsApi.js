import { Buffer } from "buffer";

import axios from "axios";
import { createPatch } from "rfc6902";

const apiVersion = "7.1-preview.3";

/**
 * This class is used to communicate with the Azure DevOps API
 * TODO: add data validation and input checks to every method
 * TODO: team object already has a project ID.. use that instead of requesting project ID
 */
export class AzureDevOpsApi {
    constructor(url, token) {
        this.url = url;
        this.token = token;
        this.instance = axios.create({
            baseURL: url,
            headers: {
                common: {
                    // "Authorization": "Basic <Username>:<PAT Token>"
                    // When using PAT there is no username, but you still need to include : in the base64 conversion
                    "Authorization": `Basic ${Buffer.from(":" + token).toString("base64")}`,
                    "Content-Type": "application/json"
                }
            },
            params: {
                "api-version": apiVersion
            }
        });
    }

    /**
     * Get a list of all teams.
     * @param {boolean} expand A value indicating whether or not to expand Identity information in the result WebApiTeam object.
     * @param {boolean} mine If true, then return all teams requesting user is member. Otherwise return all teams user has read access.
     * @param {Number} skip Number of teams to skip.
     * @param {Number} top Maximum number of teams to return.
     */
    async getTeams(expand = false, mine = false, skip = 0, top = Number.MAX_VALUE) {
        return this.instance.get("_apis/teams").then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Get all teams associated with project.
     * @param projID ID of project to query by
     * @returns {JSON} of all associated teams
     */
    async getTeam(projID) {
        return this.instance.get(`_apis/projects/${projID}/teams`).then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Get all projects in the organization that the authenticated user has access to.
     */
    async getProjects() {
        return this.instance.get("_apis/projects").then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Get project with the specified id or name
     * @param {string} projectId the project id or name
     */
    async getProject(projectId) {
        return this.instance.get(`_apis/projects/${projectId}`).then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Gets work items of type "Task" (Maximum 20000)
     * @param {string} project Project ID or project name
     * @param {string} team Team ID or team name
     */
    async getWorkItemTasks(project, team) {
        return this.queryWIQL("Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'Task'", project, team);
    }

    //TODO: think about removing requirement for team, considering we will not be pulling data related directly to them.
    // should we leave this potential function for future devs, or is that messy?
    /**
     * Gets ALL work items (Maximum 20000)
     * @param {string} project Project ID or project name
     * @param {string} team Team ID or team name
     */
    async getAllWorkItems(project, team) {
        return this.queryWIQL("Select [System.Id], [System.Title], [System.State] From WorkItems", project, team);
    }

    /**
     * Gets project-specific work items (Maximum 20000)
     * @param {string} project Project ID or project name
     * @param {string} team Team ID or team name
     */
    async getPrjWorkItems(project, team) {
        return this.queryWIQL(`Select [System.Id], [System.Title], [System.State], [System.AreaPath] From WorkItems Where [System.AreaPath] = '${project}'`, project, team);
    }

    /**
     * Returns a single work item. $Expand relations also returns info on attachments.
     * @param {string} project Project ID or project name
     * @param {string} id The work item id
     */
    async getWorkItem(project, id) {
        return this.instance.get(`${project}/_apis/wit/workitems/${id}`,
            {
                params: {
                    "$expand": "relations",
                    "api-version": "7.1-preview.2"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Returns a list of work items (Maximum 200)
     * @param {string} project Project ID or name
     * @param {Number[]} ids Array of work item ids
     */
    async getWorkItems(project, ids) {
        return this.instance.get(`${project}/_apis/wit/workitems?ids=${ids.join(",")}`,
            {
                params: {
                    "$expand": "relations",
                    "api-version": "7.1-preview.2"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Creates a work item in devops.
     * @param {string} project Project ID or name
     * @param {string} type work item type - i.e. task, issue, etc.
     * @param {object} data the fields needed to create a new work item
     * @returns {string} error if failed, work item info if successful
     */
    async createWorkItem(project, type, data) {
        return this.instance.post(`${project}/_apis/wit/workitems/$${type}`,
            createPatch({ "fields": {} }, data),
            { params: { "api-version": "7.1-preview.3" }, headers: { "content-type": "application/json-patch+json" }, }).then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Add a comment to an existing work item.
     * @param {string} project Project ID or name
     * @param {string} workItemId ticket to add comment to
     * @param {object} data the fields needed to create a new work item
     * @returns {string} error if failed, work item info if successful
     */
    async addWorkItemComment(project, workItemId, data) {
        return this.instance.post(`${project}/_apis/wit/workItems/${workItemId}/comments`,
            {
                "text": data
            },
            { params: { "api-version": "7.1-preview.3" } }).then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Update existing work item.
     * @param {string} project Project ID or name
     * @param {string} workItemID single work item ID
     * @param {object} data the fields needed to create a new work item
     * @param {string }patchType string describing patch format required (fields update or attachment update)
     * @returns {string} error if failed, work item info if successful
     */
    async updateWorkItem(project, workItemID, data, patchType) {
        let patchInput;
        if(patchType === "fields") {
            patchInput = createPatch({ "fields": {} }, data);
        } else if(patchType === "relations") {
            patchInput = createPatch({ "relations": [] }, data);
        }
        return this.instance.patch(`${project}/_apis/wit/workitems/${workItemID}`,
            patchInput,
            { params: { "api-version": "7.1-preview.3" }, headers: { "content-type": "application/json-patch+json" }, }).then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Upload an attachment to DevOps.
     * New Ticket with attachment order of operations:
     * - create ticket and collect ticket ID
     * - upload attachment to DevOps, get upload location info
     * - update work item with upload location info
     * @param {string} project Project ID or name
     * @param {file} uploadData the attachment to upload
     * @returns {string} error if failed, work item info if successful
     */
    async createWorkItemAttachment(project, uploadData) {
        return this.instance.post(`${project}/_apis/wit/attachments`,
            uploadData,
            {
                params: {
                    "api-version": "7.1-preview.3"
                },
                headers: { "content-type": "application/octet-stream" }
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Return work item types for testing and development purposes. Helpful display of what fields are required for ticket creation
     * @param {string} processId process to pull work item types from
     * @returns {string} error if failed, work item type info if successful
     */
    async getWorkItemTypes(processId) {
        return this.instance.get(`_apis/work/processdefinitions/${processId}/workitemtypes`,
            {
                params: {
                    "api-version": "4.0-preview.1"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Get the icon associated with each work item type.
     * @returns {string} error if failed, icon information if successful.
     */
    async getWorkItemTypeIcons() {
        return this.instance.get("_apis/wit/workitemicons",
            {
                params: {
                    "api-version": "7.1-preview.1"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Get a list of all work item states associated with ticket type.
     * @param {string} processId process ID
     * @param {string} witRefID work item type ID
     * @returns {string} error if failed, list of state definitions if successful
     */
    async getWorkItemStates(processId, witRefID) {
        return this.instance.get(`_apis/work/processdefinitions/${processId}/workItemTypes/${witRefID}/states`,
            {
                params: {
                    "api-version": "4.1-preview.1"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * This method returns a list of processes associated with an organization.
     * @returns {string} error if failed, all processes if
     */
    async getProcessesList() {
        return this.instance.get("_apis/process/processes",
            {
                params: { "api-version": "6.0" }
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Get project properties. Helpful for retrieving process ID.
     * @param {string} project Project ID or name
     * @returns {string} error if failed, all project properties if successful
     */
    async getProjectProperties(project) {
        return this.instance.get(`_apis/projects/${project}/properties`,
            {
                params: {
                    "api-version": "6.0-preview.1"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Deletes a single work item. This method sends the WI to the DevOps recycle bin.
     * @param {string} project Project ID or name
     * @param {string} workItemID single work item ID
     * @returns {string} error if failed, status code 200 if successful
     */
    async deleteWorkItem(project, workItemID) {
        return this.instance.delete(`${project}/_apis/wit/workitems/${workItemID}`,
            {
                params: {
                    "api-version": "7.1-preview.3"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /*CURRENTLY UNUSED*/
    /**
     * Download specific attachment.
     * @param {string} project Project ID or name
     * @param {string} attachmentId single attachment ID
     * @returns {string} error if failed, status code 200 if successful
     */
    async downloadAttachment(project, attachmentId) {
        return this.instance.get(`${project}/_apis/wit/attachments/${attachmentId}`,
            {
                params: {
                    "download": true,
                    "api-version": "7.1-preview.3"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Gets the results of the query given its WIQL.
     * @param {string} query The statement to pass through WIQL
     * @param {string} project The project ID or name
     * @param {string} team The team ID or name
     */
    async queryWIQL(query, project, team) {
        /**
         * TODO: Look into $top parameter.. hardcode max configurable integer to 20,000?
         *       Add a failsafe for situations where there are more than 20k entries?
         */
        return this.instance.post(`${project}/${team}/_apis/wit/wiql`, {
            "query": query
        },
        {
            // Some API endpoints only work on specific versions... so manually overriding the default param is sometimes needed
            params: {
                "api-version": "7.1-preview.2"
            }
        }).then(res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Get a list of members for a specific team.
     * @param {string} project The name or ID (GUID) of the team project the team belongs to.
     * @param {string} team The name or ID (GUID) of the team.
     */
    async getTeamMembers(project, team) {
        return this.instance.get(`_apis/projects/${project}/teams/${team}/members`,
            {
                params: {
                    "api-version": "7.1-preview.2"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Get a list of all members that are a part of a project.
     * @param {string} project The name or ID (GUID) of the project.
     */
    async getAllTeamMembers(project) {
        // map the teams into an array of IDs
        // [id, id, id]
        const teams = await this.getTeams().then(val => val.value.map(item => item.id));

        // loop through all the teams in the project and merge them into a single object
        const temp = { count: 0, value: [] };
        for (let i = 0; i < teams.length; i++) {
            const team = teams[i];
            
            await this.getTeamMembers(project, team).then(val => {
                val.value.forEach(member => {
                    if (temp.value.every(tempMember => tempMember.identity.id !== member.identity.id)) {
                        temp.count++;
                        temp.value.push(member);
                    }
                });
            });

            return temp;
        }
    }

    async getIterations(project) {
        return this.instance.get(`${project}/_apis/work/teamsettings/iterations`,
            {
                params: {
                    "api-version": "7.1-preview.1"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }
}
