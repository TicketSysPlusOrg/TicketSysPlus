import axios from "axios";
import { Buffer } from "buffer";

const apiVersion = "7.1-preview.3";

const thisDataBody = [
    {
        "op": "add",
        "path": "/fields/System.IterationId",
        "from": null,
        "value": "f734876c-5645-4044-aa87-58ffe5d4461c"
    },
    {
        "op": "add",
        "path": "/fields/System.AreaId",
        "from": null,
        "value": "f734876c-5645-4044-aa87-58ffe5d4461c"
    },
    {
        "op": "add",
        "path": "/fields/System.State",
        "from": null,
        "value": "To Do"
    },
    {
        "op": "add",
        "path": "/fields/System.Title",
        "from": null,
        "value": "Sample Task Title"
    },
    {
        "op": "add",
        "path": "/fields/System.Description",
        "from": null,
        "value": "This is a basic description."
    },
    {
        "op": "add",
        "path": "/fields/System.Priority",
        "from": null,
        "value": 2
    }
];

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

    //TODO: add method that retrieves work items by team only for use in usertickets. so far only have ability to pull all by project.

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

    /**
     * Returns a list of work items (Maximum 200)
     * @param {string} project Project ID or name
     * @param {Number[]} ids Array of work item ids
     */
    async getWorkItems(project, ids) {
        return this.instance.get(`${project}/_apis/wit/workitems?ids=${ids.join(",")}`,
            {
                data : thisDataBody
            },
            {
                params: {
                    "api-version": "7.1-preview.2"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /*https://dev.azure.com/{organization}/{project}/_apis/wit/workitems/${type}?api-version=7.1-preview.3*/
    //TODO: get create functioning and make it dynamic. so far getting 404 - bad request
    /**
     * Creates a work item in devops. Currently in a simple test state.
     * @param {string} project Project ID or name
     * @param {string }type work item type - i.e. task, issue, etc.
     * @returns {string} error if failed, work item info if successful
     */
    async createWorkItem(project, type) {
        return this.instance.patch(`${project}/_apis/wit/workitems/${type}`,
            [
                    {
                        "op": "add",
                        "path": "/fields/System.Title",
                        "from": null,
                        "value": "Sample Task Title"
                    }
                ]
            , {params: { "api-version": "7.1-preview.3" }, headers: { "content-type": "application/json-patch+json"}, }).then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Return work item types for testing and development purposes. Helpful display of what fields are required for ticket creation
     * @param {string} project Project ID or name
     * @returns {string} error if failed, work item info if successful
     */
    async getWorkItemTypes(project) {
        return this.instance.get(`${project}/_apis/wit/workitemtypes`,
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
