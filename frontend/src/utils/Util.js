import parse from "html-react-parser";

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
