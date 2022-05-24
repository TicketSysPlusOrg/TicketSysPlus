// specific ticket we want to examine
import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import userTickets from "./userTickets";
import {azureConnection} from "../../index";

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
            {allTicketInfo ?
                <Row>
                    <Col>
                        {/*TODO: fields for project/teams, field for ticket type (task, epic, issue*/}
                        {/*TODO: validation  for all fields*/}
                        <Form className="col s12" onSubmit={updateTicket}>

                            {/*ticket title and work type*/}
                            <Row className="mb-2">
                                <h4>{allTicketInfo ? allTicketInfo.fields["System.Title"] : null}</h4>
                                <h5>Ticket Type: {allTicketInfo ? allTicketInfo.fields["System.WorkItemType"] : null}</h5>
                            </Row>
                            {/*ticket state and priority*/}
                            <Row className="mb-2">
                                <Col>Ticket State: {allTicketInfo ? allTicketInfo.fields["System.State"] : null}</Col>
                                <Col>Priority: {allTicketInfo ? allTicketInfo.fields["Microsoft.VSTS.Common.Priority"] : null}</Col>
                            </Row>

                            {/*ticket description*/}
                            <Row className="mb-2">
                                <Col>
                                    <h5>Ticket Description</h5>
                                    <article className={"border border-1 border-dark p-2"}>
                                        {allTicketInfo ? allTicketInfo.fields["System.Description"] : null}
                                    </article>
                                </Col>
                            </Row>

                            {/*ticket created date*/}
                            <Row className="mb-2">
                                <h5>Created Date: {allTicketInfo ? allTicketInfo.fields["System.CreatedDate"] : null}</h5>
                            </Row>

                            {/*ticket attachments*/}
                            {/*<Row className="mb-2">*/}

                            {/*</Row>*/}

                            <Button onClick={handleClose} type="submit" name="action" className="float-end mt-2">
                                Submit Changes
                            </Button>
                        </Form>
                    </Col>
                </Row>
                : <Container>Loading Ticket Info...</Container>}

        </>
    );
}

export default singleTicketView;
