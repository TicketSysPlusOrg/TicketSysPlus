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

export function checkAndRemove(stringInput) {
    if (stringInput === undefined || stringInput == null || stringInput.trim() === "") {
        return stringInput;
    }
    return parse(stringInput);
}
