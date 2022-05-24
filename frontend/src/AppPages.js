import React from "react";
import { Routes, Route } from "react-router";
import { MsalProvider } from "@azure/msal-react";
import StandardUser from "./Components/TicketSysPlusPages/StandardUser";
import Admin from "./Components/TicketSysPlusPages/Admin";
import Error from "./Components/TicketSysPlusPages/ErrorPage";
import Landing from "./Components/TicketSysPlusPages/Landing";
import TSPAppFetched from "./Components/TicketSysPlusPages/TSPAppFetched";
import PropTypes from "prop-types";

export const Context = React.createContext();


function MainApp({ pca }) {
    return (
        <MsalProvider instance={pca}>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<StandardUser />} exact />
                <Route path="/admin" element={<Admin />} />
                <Route path="/test" element={<TSPAppFetched />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </MsalProvider>
    );
}

MainApp.propTypes = {
    pca: PropTypes.object
};

export default MainApp;
