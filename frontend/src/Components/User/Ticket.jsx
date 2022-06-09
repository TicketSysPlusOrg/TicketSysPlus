// specific ticket we want to examine
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import PropTypes from "prop-types";

import { azureConnection } from "../../index";
import { parseHtml } from "../../utils/Util";

import TicketForm from "./TicketForm";
import DeleteButton from "./DeleteButton";


function Ticket({ ticketData, clickClose, setShow }) {
    const [thisTicketInfo, setThisTicketInfo] = useState(null);
    const [allTicketInfo, setAllTicketInfo] = useState(null);

    useEffect(() => {
        setThisTicketInfo(ticketData);
    }, []);

    useEffect(() => {
        if(thisTicketInfo !== null) {
            (async() => {
                const getTicketInfo = await azureConnection.getWorkItem(thisTicketInfo[0], thisTicketInfo[1]);
                setAllTicketInfo(getTicketInfo);
                console.log(getTicketInfo);
            })();
        }
    }, [thisTicketInfo]);

    const [renderEdit, setRenderEdit] = useState(null);

    /*TODO: need to close modal and refresh tickets*/
    /*delete ticket*/
    const [deleteTicket, setDeleteTicket] = useState(false);
    /*delete ticket call when deleteTicketId !== null*/
    useEffect(() => {
        if(deleteTicket) {
            const deleteThisTicket = azureConnection.deleteWorkItem(allTicketInfo.fields["System.AreaPath"], allTicketInfo.id);
            clickClose(true);
        }
    }, [deleteTicket]);

    return (
        <>
            {renderEdit === null ?
                allTicketInfo ?
                    <Row>
                        <Col>
                            {/*TODO: fields for project/teams, field for ticket type (task, epic, issue*/}
                            {/*TODO: validation  for all fields*/}
                            <Form className="col s12">

                                {/*ticket title*/}
                                <Row className={"mb-4"}>
                                    <Col xs={10} className={"d-flex align-items-center"}>
                                        <h4 className={"mt-1"}>{allTicketInfo.fields["System.Title"]}</h4>
                                    </Col>
                                    <Col xs={1} className={"mb-2"}>
                                        <DeleteButton setDeleteTicket={setDeleteTicket} />
                                    </Col>
                                    <hr className={"mt-1"}/>
                                </Row>

                                <Row className={"mb-4"}>
                                    <h5>ASSIGNED TO: {allTicketInfo.fields["System.AssignedTo"] ? allTicketInfo.fields["System.AssignedTo"] : "No assignment"}</h5>
                                </Row>

                                {/*work type, state, priority*/}
                                <Row className={"mb-4"}>
                                    <h5>TICKET TYPE: {allTicketInfo.fields["System.WorkItemType"]}</h5>
                                </Row>
                                <Row className={"mb-4"}>
                                    <h5>TICKET STATE: {allTicketInfo.fields["System.State"]}</h5>
                                </Row>
                                <Row className={"mb-4"}>
                                    <h5>PRIORITY: {allTicketInfo.fields["Microsoft.VSTS.Common.Priority"]}</h5>
                                </Row>

                                {/*ticket description*/}
                                <Row className={"my-4"}>
                                    <Col>
                                        <h5>TICKET DESCRIPTION</h5>
                                        <article className={"border border-1 p-2 articleStyle"}>
                                            {parseHtml(allTicketInfo.fields["System.Description"])}
                                        </article>
                                    </Col>
                                </Row>

                                {/*ticket mentions section*/}
                                <Row className={"my-4"}>
                                    <Col>
                                        <h5>TICKET COMMENTS</h5>
                                        <article className={"border border-1 p-2 articleStyle"}>
                                            {parseHtml(allTicketInfo.fields["Microsoft.VSTS.CMMI.Comments"])}
                                        </article>
                                    </Col>
                                </Row>

                                {/*ticket created date*/}
                                <Row className={"my-4"}>
                                    <h5>CREATED DATE: {allTicketInfo.fields["System.CreatedDate"]}</h5>
                                </Row>

                                {/*ticket created by*/}
                                <Row className={"my-4"}>
                                    <h5>CREATED BY: {allTicketInfo.fields["System.CreatedBy"]}</h5>
                                </Row>

                                {/*ticket attachments*/}
                                <Row className="mb-4">
                                    <h5>ATTACHMENTS</h5>
                                    {allTicketInfo.relations ?
                                        allTicketInfo.relations.map((thisAttachment, index) => {
                                            return(
                                                <Col xs={3} key={index} className={"my-2"}>
                                                    <Card className={"shadow"}>
                                                        <Card.Body>
                                                            <Card.Title title={thisAttachment.attributes.name} className={"text-truncate"}>
                                                                {thisAttachment.attributes.name}
                                                            </Card.Title>
                                                            <br />
                                                            <a className={"float-end"} href={thisAttachment.url + "?fileName=" + thisAttachment.attributes.name + "&download=true"} download>Download</a>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>);
                                        })
                                        : <div className={"border border-1 p-2 articleStyle"}>No attachments.</div>}
                                </Row>

                                <hr />

                                <Button onClick={() => setRenderEdit(true)} type={"button"} name={"action"} className={"mt-2"}>
                                    EDIT TICKET
                                </Button>

                                <Button onClick={clickClose} type={"button"} name={"action"} className={"float-end mt-2"}>
                                    CLOSE
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    : <Container>Loading Ticket Info...</Container>
                : null}

            {renderEdit === true ? <TicketForm editTicket={true} ticketInfo={allTicketInfo} setShow={setShow}  /> : null}
        </>
    );
}

Ticket.propTypes = {
    ticketData: PropTypes.array,
    clickClose: PropTypes.func,
    setShow: PropTypes.func
};

export default Ticket;
