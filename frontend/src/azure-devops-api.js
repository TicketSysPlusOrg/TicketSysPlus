import axios from "axios";
import { Buffer } from "buffer";

const apiVersion = "7.1-preview.3";

/**
 * This class is used to communicate with the Azure DevOps API
 * TODO: add data validation and input checks to every method
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

    /**
     * Gets ALL work items (Maximum 20000)
     * @param {string} project Project ID or project name
     * @param {string} team Team ID or team name
     */
    async getAllWorkItems(project, team) {
        return this.queryWIQL("Select [System.Id], [System.Title], [System.State] From WorkItems", project, team);
    }

    /**
     * Get all work items that are equal to and greater than the chosen id
     * @param {string} project Project ID or project name
     * @param {string} team Team ID or team name
     * @param {string} id WorkItem ID
     */
    async getWorkItemWhereGreaterThanID(project, team, id) {
        // FIXME: why ">=" ?? it's for testing purposes.
        return this.queryWIQL(`Select [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.Description] From WorkItems Where [System.Id] >= '${id}'`, project, team);
    }

    /**
     * Returns a single work item.
     * @param {string} project Project ID or project name
     * @param {string} id The work item id
     */
    async getWorkItem(project, id) {
        return this.instance.get(`${project}/_apis/wit/workitems/${id}`,
            {
                params: {
                    "api-version": "7.1-preview.2"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    //TODO: check if ids.join is possible. i'm getting errors, so am doing that computation elsewhere.
    /**
     * Returns a list of work items (Maximum 200)
     * @param {string} project Project ID or name
     * @param {Number[]} ids Array of work item ids
     */
    async getWorkItems(project, ids) {
        return this.instance.get(`${project}/_apis/wit/workitems?ids=${ids}`,
            {
                params: {
                    "api-version": "7.1-preview.2"
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
}
