import parse from "html-react-parser";

import { backendApi } from "../index";

/**
 * Parses HTML string into React Components
 * @param {string} input The HTML string to parse into React Components
 */
export function parseHtml(input) {
    if (input === undefined || input == null || input.trim() === "") {
        return input;
    }

    // remove styling from elements before parsing
    input = input.replace(/data-darkreader-inline-bgcolor=".*?"|style=".*?"/g, "");

    return parse(input);
}

/**
 * Checks if an email is saved as an admin in the backend.
 * TODO: make it not async so you don't have to await the isAdmin method to get output
 * @param {string} email the email to look up
 * @returns {boolean} true if the email is from an admin, false otherwise
 */
export async function isAdmin(email) {
    const { data } = await backendApi.get("admins")
        .catch((err) => {
            console.log(err);
        });
    return data.some(admin => admin.email === email);
}

/**
 * Gets the Settings JSON Object
 */
export async function getSettings() {
    const { data } = await backendApi.get("settings")
        .catch((err) => {
            console.log(err);
        });
    return data;
}

/**
 * Move items in an array
 * @param {any[]} arr the array to modify
 * @param {number} fromIndex the index to move from
 * @param {number} toIndex the index to move to
 */
export function arrayMove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}
