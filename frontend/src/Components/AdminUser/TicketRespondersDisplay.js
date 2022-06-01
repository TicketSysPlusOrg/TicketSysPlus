import React, {useEffect, useState} from "react";
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import fetchData from "../APIActions/FetchData";
import "../TicketSysPlusPages/TSPApp.css";
import Responders from "./Responders";

function TicketResponders(props) {

    return (
        <>
            <Responders />
        </>
    );

}

export default TicketResponders;
