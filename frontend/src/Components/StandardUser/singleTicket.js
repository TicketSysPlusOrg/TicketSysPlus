// specific ticket we want to examine
import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import {azureConnection} from "../../index";
import {checkAndRemove} from "../../AppPages";
import TicketForm from "./ticketForms";

function singleTicketView(props) {
    const [thisTicketInfo, setThisTicketInfo] = useState(null);
    const [allTicketInfo, setAllTicketInfo] = useState(null);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    function updateTicket() {
        return null;
    }

    useEffect(() => {
        setThisTicketInfo(props.ticketData);
    }, []);

    useEffect(() => {
        if(thisTicketInfo !== null) {
            (async() => {
                const getTicketInfo = await azureConnection.getWorkItem(thisTicketInfo[0], thisTicketInfo[1]);
                setAllTicketInfo(getTicketInfo);
            })();
        }
    }, [thisTicketInfo]);

    const [renderEdit, setRenderEdit] = useState(null);

    /*
    Microsoft.VSTS.Common.Priority: 4
    Microsoft.VSTS.Common.StateChangeDate: "2022-04-22T01:31:55.617Z"
    System.AreaPath: "MotorQ Project"
    System.ChangedBy: "Nathan Arrowsmith <Arrowsmith.Nathan@student.greenriver.edu>"
    System.ChangedDate: "2022-04-22T01:31:55.617Z"
    System.CommentCount: 1
    System.CreatedBy: "Nathan Arrowsmith <Arrowsmith.Nathan@student.greenriver.edu>"
    System.CreatedDate: "2022-04-22T01:31:55.617Z"
    System.Description: "<div>initial ticket creation&nbsp; </div>"
    System.History: "<div>test </div>"
    System.IterationPath: "MotorQ Project"
    System.Reason: "Added to backlog"
    System.State: "To Do"
    System.TeamProject: "MotorQ Project"
    System.Title: "Hello World "
    System.WorkItemType: "Task"
    */

    return (
        <>
            {renderEdit === null ?
                allTicketInfo ?
                    <Row>
                        <Col>
                            {/*TODO: fields for project/teams, field for ticket type (task, epic, issue*/}
                            {/*TODO: validation  for all fields*/}
                            <Form className="col s12" onSubmit={updateTicket}>

                                {/*ticket title and work type*/}
                                <Row className="mb-4">
                                    <h4>{allTicketInfo.fields["System.Title"]}</h4>
                                    <hr/>
                                    <h5>Ticket Type: {allTicketInfo.fields["System.WorkItemType"]}</h5>
                                </Row>

                                {/*ticket state and priority*/}
                                <Row className="my-4">
                                    <Col>Ticket State: {allTicketInfo.fields["System.State"]}</Col>
                                    <Col>Priority: {allTicketInfo.fields["Microsoft.VSTS.Common.Priority"]}</Col>
                                </Row>

                                {/*ticket description*/}
                                <Row className="my-4">
                                    <Col>
                                        <h5>Ticket Description</h5>
                                        <article className={"border border-1 border-dark p-2"}>
                                            {checkAndRemove(allTicketInfo.fields["System.Description"])}
                                        </article>
                                    </Col>
                                </Row>

                                {/*ticket created date*/}
                                <Row className="my-4">
                                    <h5>Created Date: {allTicketInfo.fields["System.CreatedDate"]}</h5>
                                </Row>

                                {/*ticket created by*/}
                                <Row className="my-4">
                                    <h5>Created Date: {allTicketInfo.fields["System.CreatedBy"]}</h5>
                                </Row>

                                {/*ticket attachments*/}
                                {/*<Row className="mb-2">*/}

                                {/*</Row>*/}

                                <Button onClick={e => setRenderEdit(true)} type={"button"} name={"action"} className={"mt-2"}>
                                    Edit Ticket
                                </Button>

                                <Button onClick={handleClose} type={"submit"} name={"action"} className={"float-end mt-2"}>
                                    Close
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                    : <Container>Loading Ticket Info...</Container>
                : null}

            {renderEdit ? <TicketForm editTicket={true} ticketInfo={allTicketInfo}  /> : null}
        </>
    );
}

export default singleTicketView;
