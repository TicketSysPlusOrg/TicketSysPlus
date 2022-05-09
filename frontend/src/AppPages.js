import React from 'react';
import { Routes, Route } from 'react-router'
import StandardUser from "./Components/TicketSysPlusPages/StandardUser";
import Admin from "./Components/TicketSysPlusPages/Admin";
import Error from "./Components/TicketSysPlusPages/ErrorPage";
import TSPAppFetched from "./Components/TicketSysPlusPages/TSPAppFetched";

function MainApp() {
        return (
            <>
                    <Routes>
                        <Route path="/" element={<TSPAppFetched />} />
                        <Route path="/user" element={ <StandardUser />} exact/>
                        <Route path="/admin" element={ <Admin />}/>
                        <Route path="*" element={ <Error />}/>
                    </Routes>
            </>
        );
}

export default MainApp;