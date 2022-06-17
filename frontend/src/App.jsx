import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { useAccount, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

import User from "./Components/User";
import Admin from "./Components/Admin";
import Settings from "./Components/Settings";
import Error from "./Components/Error";
import Landing from "./Components/Landing";
import Loading from "./Components/Loading";
import { apiConfig } from "./authConfig";
import { getSettings } from "./utils/Util";

import { azureConnection } from "./index";

/**
 * Application component that handles page routes (standard user, admin, landing, settings, error).
 * @returns {JSX.Element} App component.
 */
function App() {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [tokenCheck, settingTokenCheck] = useState(null);

    const [iterationPath, setIterationPath] = useState("");
    const isAuthenticated = useIsAuthenticated();

    useEffect(() => {
        instance.acquireTokenSilent({
            ...apiConfig,
            account: accounts[0]
        }).then(async (response) => {
            console.log("Setting the token...");
            const settingToken = await azureConnection.setToken(response.accessToken);
            settingTokenCheck(settingToken);
        }).catch(async (error) => {
            if (error instanceof InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return await instance.acquireTokenRedirect(apiConfig).catch(error => {
                    console.log(error);
                });
            }
        });
        (async () => {
            const settings = await getSettings();

            /*set iteration path per admin settings panel*/
            if (settings !== undefined && settings.length > 0) {
                const settingsObj = JSON.parse(settings[0].body);
                setIterationPath(settingsObj.iterationPath);
            }
        })();
    }, [accounts, account, instance]);

    return (
        <Routes>
            { isAuthenticated && tokenCheck === null && (<Route path="*" element={<Loading />} exact />)}
            { isAuthenticated && tokenCheck !== null && (<Route path="/" element={<User iterationPath={iterationPath} />} exact />) }
            { !isAuthenticated && (<Route path="/" element={<Landing />} exact />) }
            {/* TODO: block /admin and /settings routes if not admin */}
            <Route path="/admin" element={<Admin iterationPath={iterationPath} />} exact />
            <Route path="/settings" element={<Settings iterationPath={iterationPath} />} exact />
            <Route path="*" element={<Error />} />
        </Routes>
    );
}
export default App;
