import parse from "html-react-parser";
import axios from "axios";

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

export async function isAdmin(email) {
    const { data } = await axios.get("http://localhost:4001/admins")
        .catch((err) => {
            console.log(err);
        });
    return data.some(admin => admin.email === email);
}

export async function getSettings() {
    const { data } = await axios.get("http://localhost:4001/settings")
        .catch((err) => {
            console.log(err);
        });
    return data;
}
