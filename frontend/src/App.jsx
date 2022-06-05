import React from "react";
import { Route, Routes } from "react-router";
import { useIsAuthenticated } from "@azure/msal-react";

import User from "./Components/User";
import Admin from "./Components/Admin";
import Settings from "./Components/Settings";
import Error from "./Components/Error";
import Landing from "./Components/Landing";

function App() {
    const isAuthenticated = useIsAuthenticated();

    return (
        <Routes>
            { isAuthenticated && (<Route path="/" element={<User />} exact />) }
            { !isAuthenticated && (<Route path="/" element={<Landing />} exact />) }
            <Route path="/admin" element={<Admin />} exact />
            <Route path="/settings" element={<Settings />} exact />
            <Route path="*" element={<Error />} />
        </Routes>
    );
}

export default App;
