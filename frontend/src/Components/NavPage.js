import React from "react";
import {NavLink} from 'react-router-dom'
import './TicketSysPlusPages/TSPApp.css'

function NavPage(props) {
    const textColor = "white";

    //trying to override button stuff nonfunctional so far
    return (
        <>
            <div className="container">
                <NavLink to="/" style={(isActive)=>({
                    color: "black",
                    textDecoration: "underline"
                })}>
                    <button type="button" className='btn btn-primary mx-3'>TEST PAGE</button>
                </NavLink>
                <NavLink to="/user">
                    <button type="button" className="btn btn-primary mx-3">USER PAGE</button>
                </NavLink>
                <NavLink to="/admin">
                    <button type="button" className="btn btn-primary mx-3">ADMIN PAGE</button>
                </NavLink>
            </div>
        </>
    )

}

export default NavPage;