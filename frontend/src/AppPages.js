import React from "react";
import {Route, Routes} from "react-router";
import {useIsAuthenticated} from "@azure/msal-react";
import StandardUser from "./Components/TicketSysPlusPages/StandardUser";
import Admin from "./Components/TicketSysPlusPages/Admin";
import Error from "./Components/TicketSysPlusPages/ErrorPage";
import Landing from "./Components/TicketSysPlusPages/Landing";
import parse from "html-react-parser";

function MainApp() {
    const isAuthenticated = useIsAuthenticated();

    return (
        <Routes>
            { isAuthenticated && (<Route path="/" element={<StandardUser />} exact />) }
            { !isAuthenticated && (<Route path="/" element={<Landing />} exact/>) }
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Error />} />
        </Routes>
    );
}

export default MainApp;

/**
 * Converts any string into React Components
 * @param {string} input The string to parse into React Components
 */
export function checkAndRemove(input) {
    if (input === undefined || input == null || input.trim() === "") {
        return input;
    }

    // remove styling from elements before parsing
    input = input.replace(/data-darkreader-inline-bgcolor=".*?"|style=".*?"/g, "");

    return parse(input);
}
