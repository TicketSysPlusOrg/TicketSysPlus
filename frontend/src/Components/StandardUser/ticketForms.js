// forms to fill to create a new ticket
import React, {createRef, useEffect, useState} from "react";
import axios from "axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import ConditionalForms from "./ConditionalForms";
import {azureConnection} from "../../index";

//TODO: make react-bootstrap friendly.
//TODO: make file uploads real
function TicketForm() {
    const [show, setShow] = useState(false);
    const [prjID, setprjID] = useState(null);

    const handleClose = () => setShow(false);

    let inputTitle = createRef();
    let inputDesc = createRef();
    let inputDate = createRef();
    let inputPriority = createRef();
    let inputMentions = createRef();
    let inputAttachment = createRef();

    /*TODO: currently projects for createTicket call to devops. need to use this & teams methods for fields in form. */
    useEffect(() => {
        (async () => {
            const projID = await azureConnection.getProjects();
            setprjID(projID.value[0].id);
        })();
    }, []);

    /*get vals from ref, post to db*/
    function submitTicket(SubmitEvent) {
        //TODO: stop reload of page but reload modal...? or could JUST close modal and reload the visible tickets
        // SubmitEvent.preventDefault();

        const ticketTitle = inputTitle.current.value;
        const ticketDesc = inputDesc.current.value;
        const tickDate = inputDate.current.value;
        const tickPriority = inputPriority.current.value;
        const tickMentions = inputMentions.current.value.split(/[,| ]+/).map(function (value) {
            return value.trim();
        });
        const tickAttachments = inputAttachment.current.value;

        const descAndMentions = ticketDesc + " Mentions: " + tickMentions;


        /*TODO: use due date, use attachments, what about iteration id/area id?*/
        /*TODO: dynamically fill this...? can use array with path field names and another with the values collected above, or a map...?*/
        const devOpsTickData = [
            {
                "op": "add",
                "path": "/fields/System.State",
                "from": null,
                "value": "To Do"
            },
            {
                "op": "add",
                "path": "/fields/System.Title",
                "from": null,
                "value": ticketTitle
            },
            {
                "op": "add",
                "path": "/fields/System.Description",
                "from": null,
                "value": descAndMentions
            },

        ];

        const createTicket = azureConnection.createWorkItem(prjID, "Task", devOpsTickData);
        console.log(createTicket);

        axios
            .post("http://localhost:4001/tix", {
                title: ticketTitle,
                description: ticketDesc,
                due_date: tickDate,
                priority: tickPriority,
                mentions: tickMentions,
                attachments: tickAttachments
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <Row>
                <Col>
                    {/*TODO: fields for project/teams, field for ticket type (task, epic, issue*/}
                    {/*TODO: validation  for all fields*/}
                    <Form className="col s12" onSubmit={submitTicket}>
                        <Row className="mb-2">
                            <Form.Group className="col s6">
                                <Form.Label htmlFor="ticketTitle">Ticket Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter title" ref={inputTitle} />
                                <Form.Text id="ticketTitle" name="ticketTitle" />
                            </Form.Group>
                            {/*TODO: make this mentions section autofill...? at least mention if we need to insert emails or what*/}
                            <Form.Group className="col s6">
                                <Form.Label htmlFor="tickMentions">Mentions</Form.Label>
                                <Form.Control type="text" placeholder="Enter associates" ref={inputMentions} />
                                <Form.Text id="tickMentions" name="tickMentions" />
                            </Form.Group>
                        </Row>
                        <Row className="mb-2">
                            <Form.Group className="col s6">
                                <Form.Label htmlFor="tickDate">Due Date</Form.Label>
                                <Form.Control id="tickDate" name="tickDate" ref={inputDate} type="date" />
                            </Form.Group>
                            <Form.Group className="col s6">
                                <Form.Label className="d-block">Priority</Form.Label>
                                <Form.Label htmlFor="tickPriority1" className="ms-3">
                                    1 <Form.Check inline name="tickPriority" id="tickPriority1" ref={inputPriority} type="radio" value={1} />
                                </Form.Label>
                                <Form.Label htmlFor="tickPriority2">
                                    2 <Form.Check inline name="tickPriority" id="tickPriority2" ref={inputPriority} type="radio" value={2} />
                                </Form.Label>
                                <Form.Label htmlFor="tickPriority3">
                                    3 <Form.Check inline defaultChecked name="tickPriority" id="tickPriority3" ref={inputPriority} type="radio" value={3} />
                                </Form.Label>
                                <Form.Label htmlFor="tickPriority4">
                                    4 <Form.Check inline defaultChecked name="tickPriority" id="tickPriority4" ref={inputPriority} type="radio" value={4} />
                                </Form.Label>
                            </Form.Group>
                        </Row>

                        <Row className="mb-2">
                            <Form.Group className="col s6">
                                <Form.Label htmlFor="ticketDesc">Ticket Description</Form.Label>
                                <Form.Control as="textarea" rows="2" type="text" placeholder="Enter description" ref={inputDesc} />
                                <Form.Text id="ticketDesc" name="ticketDesc" />
                            </Form.Group>
                        </Row>

                        <Row className="mb-2">
                            {/*TODO: make this attachment form real*/}
                            <Form.Group className="col s6">
                                <Form.Label htmlFor="tickAttachments">Attachments</Form.Label>
                                <Form.Control id="tickAttachments" name="tickAttachments" ref={inputAttachment} type="file" />
                            </Form.Group>
                        </Row>

                        <Row>
                            <ConditionalForms />
                        </Row>

                        <Button onClick={handleClose} type="submit" name="action" className="float-end mt-2">
                            Submit
                        </Button>
                    </Form>

                </Col>

            </Row>
        </>
    );

}

export default TicketForm;
