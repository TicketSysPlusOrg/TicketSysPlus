import axios from "axios";
import { Buffer } from "buffer";

const apiVersion = "7.1-preview.3";

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
     * Gets work items for a list of work item ids (Maximum 200)
     * @param {string} project Project ID or project name
     * @param team DevOps instance team
     */
    async getTasks(project, team) {
        return this.instance.post(`${project}/${team}/_apis/wit/wiql`, {
            "query": "Select [System.Id], [System.Title], [System.State] From WorkItems Where [System.WorkItemType] = 'Task'"
        }, {
            // Some API endpoints only work on specific versions... so manually overriding the default param is sometimes needed
            params: {
                "api-version": "7.1-preview.2"
            },
        }).then(response => {
            return response.data;
        }).catch(error => error);
    }

    /**
     * Get work items for a list of work item ids. Not just tasks, includes all work item types. (200 max)
     * @param project DevOps prj
     * @param team DevOps team
     * @returns data response or error if can't complete request
     */
    async getAllTasks(project, team) {
        //wit is work item tracking in api, wiql is work item query language
        return this.instance.post(`${project}/${team}/_apis/wit/wiql`, {
            "query": "Select [System.Id], [System.Title], [System.State] From WorkItems"
        }, {
            params: {
                "api-version": "7.1-preview.2"
            },
        }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    //TODO: either get rid of this or make it better. the "greater than or equal to id" has little utility
    /**
     * Currently setup to get all tickets with id greater than ID sent in parameter.
     * @param project the devops project name
     * @param team
     * @param id of the work item to get all since then
     * @returns {Promise<AxiosResponse<any>>}
     */
    async getWorkTicketByID(project, team, id) {
        return this.instance.post(`${project}/${team}/_apis/wit/wiql`, {
                "query": `Select [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.Description] From WorkItems Where [System.Id] >= '${id}'`
            },
            {
            params: {
            "api-version": "7.1-preview.2"
            },
        }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    /**
     * Get a single ticket.
     * @param project the devops project name
     * @param id the single work item to get
     * @returns {Promise<AxiosResponse<any>>} json of work item data
     */
    async getOneTicket(project, id) {
        return this.instance.get(`${project}/_apis/wit/workitems/${id}`,
        {
            params: {
                "api-version": "7.1-preview.2"
            },
        }).then (res => {
            return res.data;
        }).catch(err => err);
    }

    //get a BATCH of tickets
    /**
     * Get multiple tickets. Have to send get request with many ids separated by commas.
     * @param project the devops project name
     * @param ids all work item-associated ids to fetch
     * @returns {Promise<AxiosResponse<any>>} json of all the work item data
     */
    async getTicketBatch(project, ids) {
        return this.instance.get(`${project}/_apis/wit/workitems?ids=${ids}`,
            {
                params: {
                    "api-version": "7.1-preview.2"
                },
            }).then (res => {
            return res.data;
        }).catch(err => err);
    }


}
