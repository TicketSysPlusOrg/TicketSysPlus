// forms to fill to create a new ticket
import React, {createRef, useEffect, useState} from "react";
import axios from "axios";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import ConditionalForms from "./ConditionalForms";
import {azureConnection} from "../../index";
import {checkAndRemove} from "../../AppPages";
import parse from "html-react-parser";

//TODO: make file uploads real
function TicketForm(props) {
    const [show, setShow] = useState(false);
    const [prjID, setprjID] = useState(null);

    const handleClose = () => setShow(false);

    let inputTitle = createRef();
    let inputType = createRef();
    let inputDesc = createRef();
    let inputDate = createRef();
    let inputPriority = createRef();
    let inputMentions = createRef();
    let inputAttachment = createRef();
    let divDesc = createRef();

    /*currently set up just to speak with MotorqProject board.*/
    useEffect(() => {
        (async () => {
            const projID = await azureConnection.getProjects();
            setprjID(projID.value[1].id);
        })();
    }, []);


    async function submitTicket(SubmitEvent) {
        //TODO: stop reload of page but reload modal...? or could JUST close modal and reload the visible tickets
        /*SubmitEvent.preventDefault();*/

        //TODO: get system states for ticket creation and edit, make form in render, make devops method to get all possible states for dynamic generation
        /*const ticketState = ???*/
        const ticketTitle = inputTitle.current.value;
        const ticketType = inputType.current.value;
        const ticketDesc = inputDesc.current.value;
        const tickDate = inputDate.current.value;
        const tickPriority = inputPriority.current.value;
        const tickMentions = inputMentions.current.value.split(/[,| ]+/).map(function (value) {
            return value.trim();
        });
        const tickAttachments = inputAttachment.current.value;
        const descAndMentions = ticketDesc + " Mentions: " + tickMentions;

        /*TODO: use attachments, what about iteration id/area id?*/
        if(!editTicket) {
            /*create new devops ticket*/
            const devOpsTickData = {"fields": {"System.State": "To Do", "System.Title": ticketTitle, "System.Description": descAndMentions,
                "Microsoft.VSTS.Scheduling.DueDate": tickDate, "Microsoft.VSTS.Common.Priority": tickPriority, "System.WorkItemType": ticketType}};
            const createTicket = await azureConnection.createWorkItem(prjID, ticketType, devOpsTickData);

            /*post to mongodb*/
            axios
                .post("https://backend.granny.dev/tix", {
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
        } else {
            let ticketUpdates = {};

            /*check title, type, description, priority, due date, mentions, attachments when it works */
            if(inputTitle.current.value !== props.ticketInfo.fields["System.Title"]) {
                ticketUpdates["System.Title"] = ticketTitle;
            }
            if(priorityVal !== null) {
                ticketUpdates["Microsoft.VSTS.Common.Priority"] = priorityVal;
            }
            if(typeVal !== null) {
                ticketUpdates["System.WorkItemType"] = typeVal;
            }
            if(inputDate.current.value !== props.ticketInfo.fields["Microsoft.VSTS.Scheduling.DueDate"]) {
                ticketUpdates["Microsoft.VSTS.Scheduling.DueDate"] = inputDate.current.value;
            }


            const updateDevopsTickets = {"fields": ticketUpdates};
            const updateTicket = await azureConnection.updateWorkItem(prjID, props.ticketInfo.id, updateDevopsTickets);
        }
    }

    /*editTicket state.*/
    const [editTicket, getEditTicketState] = useState(null);

    useEffect(() => {
        getEditTicketState(props.editTicket);
    }, []);

    useEffect(() => {
        if(editTicket === true) {
            /*ticket title*/
            inputTitle.current.value = props.ticketInfo.fields["System.Title"];
            /*ticket type*/
            document.getElementById("tick" + props.ticketInfo.fields["System.WorkItemType"]).checked = true;
            /*description*/
            const divDescObjects = props.ticketInfo.fields["System.Description"];
            if(divDescObjects === undefined) {
                divDesc.current.innerHTML = "";
            } else if (typeof divDescObjects === "string") {
                divDesc.current.innerHTML = divDescObjects;
            } else {
                divDesc.current.innerHTML += checkAndRemove(divDescObjects.props.children);
            }
            /*priority*/
            document.getElementById("tickPriority" + props.ticketInfo.fields["Microsoft.VSTS.Common.Priority"]).checked = true;

            //TODO: CHECK DUE DATE FIELD SLICE. this is likely a lazy method and could be shaving time if done improperly
            /*due date*/
            if(props.ticketInfo.fields["Microsoft.VSTS.Scheduling.DueDate"] !== undefined) {
                inputDate.current.value = props.ticketInfo.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0,10);
            } else {
                props.ticketInfo.fields = "";
            }


            //TODO: figure out how to fill mentions from comments section of DevOps. not a field I've seen in the work item.
            /*inputMentions.current.value = props.ticketInfo.fields["System.Mentions"];*/
            //TODO: attachments stuff
            /*inputAttachment.current.value = createRef();*/
        }
    }, [editTicket]);

    /*trigger more data source forms*/
    const [anotherDataSource, setAnotherDataSource] = useState(["dataSources"]);
    function moreDataSources() {
        setAnotherDataSource([...anotherDataSource, "dataSources"]);
    }

    /*update typevals and priorityval onchange. overriding hard set from edit ticket data*/
    const [priorityVal, changePriorityVal] = useState(null);
    const [typeVal, changeTypeVal] = useState(null);

    return (
        <>
            <Row>
                <Col>
                    {/*TODO: fields for project/teams, field for ticket type (task, epic, issue)*/}
                    {/*TODO: validation  for all fields*/}
                    <Form className={"col s12"} onSubmit={submitTicket}>

                        {editTicket === true ?
                            <Row className={"mb-2"}>
                                <h4>Editing Ticket</h4>
                                <hr/>
                            </Row>
                            : null}

                        {/*TITLE*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"ticketTitle"} className={"fw-bold"}>Ticket Title</Form.Label>
                                <Form.Control type={"text"} placeholder={"Enter title"} ref={inputTitle} />
                                <Form.Text id={"ticketTitle"} name={"ticketTitle"} />
                            </Form.Group>
                            {/*TODO: make this mentions section autofill...? at least mention if we need to insert emails or what*/}
                        </Row>

                        {/*TICKET TYPE*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label className={"d-block fw-bold"}>Ticket Type</Form.Label>
                                {/*TODO: add the epic, issue, and task logos*/}
                                <div className={"d-flex justify-content-center"}>
                                    <Form.Label htmlFor={"tickEpic"} className={"ms-3"}>
                                        Epic <Form.Check className={"ms-2"} inline name={"tickType"} id={"tickEpic"} ref={inputType} type={"radio"} onChange={() => changeTypeVal("Epic")} value={"Epic"} defaultChecked={null} />
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickIssue"} className={"ms-3"}>
                                        Issue <Form.Check className={"ms-2"} inline name={"tickType"} id={"tickIssue"} ref={inputType} type={"radio"} onChange={() => changeTypeVal("Issue")} value={"Issue"} defaultChecked={null} />
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickTask"} className={"ms-3"}>
                                        Task <Form.Check className={"ms-2"} inline name={"tickType"} id={"tickTask"} ref={inputType} type={"radio"} onChange={() => changeTypeVal("Task")} value={"Task"} defaultChecked={null} />
                                    </Form.Label>
                                </div>

                            </Form.Group>
                        </Row>

                        {/*DUE DATE*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label  htmlFor={"tickDate"} className={"fw-bold d-inline-block"}>Due Date</Form.Label>
                                <div className={"d-flex justify-content-center"}>
                                    <Form.Control className={"w-75"} id={"tickDate"} name={"tickDate"} ref={inputDate} type={"date"} />
                                </div>

                            </Form.Group>
                        </Row>

                        {/*Priority*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label className={"fw-bold"}>Priority</Form.Label>
                                <div className={"d-flex justify-content-center"}>
                                    <Form.Label htmlFor={"tickPriority1"} className={"mx-2"}>
                                        1 <Form.Check className={"ms-2"} inline name={"tickPriority"} id={"tickPriority1"} ref={inputPriority} type={"radio"} onChange={() => changePriorityVal(1)} value={1} defaultChecked={null} />
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickPriority2"} className={"mx-2"}>
                                        2 <Form.Check className={"ms-2"} inline name={"tickPriority"} id={"tickPriority2"} ref={inputPriority} type={"radio"} onChange={() => changePriorityVal(2)} value={2} defaultChecked={null}/>
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickPriority3"} className={"mx-2"}>
                                        3 <Form.Check className={"ms-2"} inline name={"tickPriority"} id={"tickPriority3"} ref={inputPriority} type={"radio"} onChange={() => changePriorityVal(3)} value={3} defaultChecked={false}/>
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickPriority4"} className={"mx-2"}>
                                        4 <Form.Check className={"ms-2"} inline name={"tickPriority"} id={"tickPriority4"} ref={inputPriority} type={"radio"} onChange={() => changePriorityVal(4)} value={4} defaultChecked={null}/>
                                    </Form.Label>
                                </div>
                            </Form.Group>
                        </Row>

                        {/*MENTIONS*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"tickMentions"} className={"fw-bold"}>Mentions</Form.Label>
                                <Form.Control type={"text"} placeholder={"Enter associates"} ref={inputMentions} />
                                <Form.Text id={"tickMentions"} name={"tickMentions"} />
                            </Form.Group>
                        </Row>


                        {/*DESCRIPTION*/}
                        <Row className={"mb-2"}>
                            {editTicket === true?
                                <>
                                    <Container>
                                        <div className={"form-label fw-bold"}>Ticket Description</div>
                                        <div id={"contentEditDiv"} contentEditable={"true"} ref={divDesc} className={"form-control form"}></div>
                                    </Container>
                                </>
                                : null}
                            <Form.Group className={editTicket === true ? "col s12 d-none" : "col s12"}>
                                <Form.Label htmlFor={"ticketDesc"} className={"fw-bold"}>Ticket Description</Form.Label>
                                <Form.Control as={"textarea"} id={"areaForm"} rows={"2"} type={"text"} placeholder={"Enter description"} ref={inputDesc} />
                                <Form.Text id={"ticketDesc"} name={"ticketDesc"} />
                            </Form.Group>
                        </Row>

                        {/*ATTACHMENTS*/}
                        <Row className={"mb-2"}>
                            {/*TODO: make this attachment form real*/}
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"tickAttachments"} className={"fw-bold"}>Attachments</Form.Label>
                                <Form.Control id={"tickAttachments"} name={"tickAttachments"} ref={inputAttachment} type={"file"} />
                            </Form.Group>
                        </Row>

                        {/*CONDITIONAL FORMS*/}
                        {props.editTicket !== true?
                            <Row>
                                {anotherDataSource.map((thisSource, index) => ( <ConditionalForms key={index} /> ))}

                                <Col xs={4}>
                                    <Button onClick={moreDataSources} className={"btn-sm mt-2"}>
                                        Choose Another Source
                                    </Button>
                                </Col>
                            </Row>
                            : null
                        }

                        {/*SUBMIT BUTTONS*/}
                        {/*TODO: make button stay 'submit changes' if in 'edit ticket' version, apply put method to do so.*/}
                        {props.editTicket === true ?
                            <Button onClick={handleClose} type={"submit"} name={"action"} className={"float-end mt-2"}>
                                Update
                            </Button>
                            :
                            <Button onClick={handleClose} type={"submit"} name={"action"} className={"float-end mt-2"}>
                                Submit
                            </Button>
                        }

                    </Form>

                </Col>

            </Row>
        </>
    );

}

export default TicketForm;
