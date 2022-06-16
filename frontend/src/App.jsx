import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

import User from "./Components/User";
import Admin from "./Components/Admin";
import Settings from "./Components/Settings";
import Error from "./Components/Error";
import Landing from "./Components/Landing";
import { apiConfig } from "./authConfig";
import { azureConnection } from "./index";

function App() {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        instance.acquireTokenSilent({
            ...apiConfig,
            account: accounts[0]
        }).then((response) => {
            console.log("Setting the token...");
            azureConnection.setToken(response.accessToken);
        }).catch(async (error) => {
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return await instance.acquireTokenRedirect(apiConfig).catch(error => {
                    console.log(error);
                });
            }
        });
    }, [accounts, account, instance]);

    return (
        <Routes>
            { isAuthenticated && (<Route path="/" element={<User />} exact />) }
            { !isAuthenticated && (<Route path="/" element={<Landing />} exact />) }
            {/* TODO: block /admin and /settings routes if not admin */}
            <Route path="/admin" element={<Admin />} exact />
            <Route path="/settings" element={<Settings />} exact />
            <Route path="*" element={<Error />} />
        </Routes>
    );
}

export default App;
