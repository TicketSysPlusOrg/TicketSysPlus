// forms to fill to create a new ticket
import React, {createRef, useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import ConditionalForms from "./ConditionalForms";
import {azureConnection} from "../../index";
import {checkAndRemove} from "../../AppPages";


//TODO: make file uploads real
function TicketForm(props) {

    /*show and close vars for modal*/
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    let inputState = createRef();
    let inputTitle = createRef();
    let inputType = createRef();
    let inputDesc = createRef();
    let inputDate = createRef();
    let inputPriority = createRef();
    let inputMentions = createRef();
    let inputAttachment = createRef();
    let divDesc = createRef();

    /*prj ID state variable*/
    const [prjID, setprjID] = useState(null);

    /*currently set up just to speak with MotorqProject board.*/
    useEffect(() => {
        (async () => {
            const projID = await azureConnection.getProjects();
            setprjID(projID.value[1].id);
        })();
    }, []);

    /*ticket states*/
    const [tickStates, setTickStates] = useState(null);

    useEffect(() => {
        /*get all available ticket states*/
        (async () => {
            /*currently hardcoded for particular inherited process with custom states*/
            const getProcesses = await azureConnection.getProcessesList();
            /*console.log(getProcesses);*/

            const getTickTypes = await azureConnection.getWorkItemTypes(getProcesses.value[4].id);
            /*console.log(getTickTypes);*/

            const allTickStates = await azureConnection.getWorkItemStates(getProcesses.value[4].id, getTickTypes.value[0].id);
            setTickStates(allTickStates);
        })();
    }, []);

    async function submitTicket(SubmitEvent) {
        //TODO: stop reload of page but reload modal...? or could JUST close modal and reload the visible tickets
        /*SubmitEvent.preventDefault();*/

        const ticketTitle = inputTitle.current.value;
        const ticketType = typeVal;
        const ticketDesc = inputDesc.current.value;
        const tickDate = inputDate.current.value;
        const tickPriority = inputPriority.current.value;

        //mentions was an array when we were dealing with mongo. we can prob do diff now.
        const tickMentions = inputMentions.current.value.split(/[,| ]+/).map(function (value) {
            return value.trim();
        });

        //TODO: attachments
        const tickAttachments = inputAttachment.current.value;

        const descAndMentions = ticketDesc + " Mentions: " + tickMentions;

        /*TODO: use attachments, what about iteration id/area id?*/
        if(!editTicket) {
            /*create new devops ticket*/
            const devOpsTickData = {"fields": {"System.State": "To Do", "System.Title": ticketTitle, "System.Description": descAndMentions,
                "Microsoft.VSTS.Scheduling.DueDate": tickDate, "Microsoft.VSTS.Common.Priority": tickPriority, "System.WorkItemType": ticketType}};

            const createTicket = await azureConnection.createWorkItem(prjID, ticketType, devOpsTickData);
        } else {
            let ticketUpdates = {};

            /*check title, type, description, priority, due date, mentions, attachments when it works */
            if(inputTitle.current.value !== props.ticketInfo.fields["System.Title"]) {
                ticketUpdates["System.Title"] = ticketTitle;
            }
            if(priorityVal !== null) {
                ticketUpdates["Microsoft.VSTS.Common.Priority"] = priorityVal;
            }

            if(stateVal !== props.ticketInfo.fields["System.State"]) {
                ticketUpdates["System.State"] = stateVal;
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

    /*set initial states for forms in edit ticket view*/
    useEffect(() => {
        if(editTicket === true) {
            console.log(props.ticketInfo);
            console.log(inputState.current.selected);

            /*ticket title*/
            inputTitle.current.value = props.ticketInfo.fields["System.Title"];

            /*ticket type*/
            document.getElementById("tick" + props.ticketInfo.fields["System.WorkItemType"]).checked = true;

            /*ticket state*/
            document.getElementById("StateSelect").value = props.ticketInfo.fields["System.State"];

            /*description*/
            const divDescObjects = props.ticketInfo.fields["System.Description"];
            if(divDescObjects === undefined) {
                divDesc.current.innerHTML = "";
            } else if (typeof divDescObjects === "string") {
                divDesc.current.innerHTML = divDescObjects;
            } else {
                divDesc.current.innerHTML += checkAndRemove(divDescObjects.props.children);
            }

            /*comments*/

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
    let [anotherDataSource, setAnotherDataSource] = useState([0]);
    function moreDataSources() {
        setAnotherDataSource([...anotherDataSource, anotherDataSource.length]);
    }
    function lessDataSources() {
        if(anotherDataSource.length !== 1) {
            let sourceArr = [...anotherDataSource];
            sourceArr.pop();
            setAnotherDataSource(sourceArr);
        }
    }

    useEffect(() => {

    }, [anotherDataSource]);

    /*update statevals, typevals, and priorityval onchange. overriding hard set from edit ticket data*/
    const [priorityVal, changePriorityVal] = useState(null);
    const [typeVal, changeTypeVal] = useState(null);
    const [stateVal, changeStateVal] = useState(null);

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
                        </Row>

                        {/*TICKET TYPE*/}
                        <Row className={"mb-2"}>

                            <Form.Group className={"col s12"}>
                                <Form.Label className={"d-block fw-bold"}>Ticket Type</Form.Label>
                                {/*TODO: add the epic, issue, and task logos*/}
                                <Form.Label htmlFor={"tickEpic"} className={"ms-3"}>
                                    Epic <Form.Check className={"ms-3"} inline name={"tickType"} id={"tickEpic"} ref={inputType} type={"radio"} onChange={() => changeTypeVal("Epic")} value={"Epic"} defaultChecked={null} />
                                </Form.Label>
                                <Form.Label htmlFor={"tickIssue"} className={"ms-3"}>
                                    Issue <Form.Check className={"ms-3"} inline name={"tickType"} id={"tickIssue"} ref={inputType} type={"radio"} onChange={() => changeTypeVal("Issue")} value={"Issue"} defaultChecked={null} />
                                </Form.Label>
                                <Form.Label htmlFor={"tickTask"} className={"ms-3"}>
                                    Task <Form.Check className={"ms-3"} inline name={"tickType"} id={"tickTask"} ref={inputType} type={"radio"} onChange={() => changeTypeVal("Task")} value={"Task"} defaultChecked={null} />
                                </Form.Label>
                            </Form.Group>
                        </Row>

                        {/*TICKET STATE*/}
                        {editTicket === true ?

                            <Row className={"mb-2"}>
                                <Form.Group className={"col s12"}>

                                    <Form.Label className={"d-block fw-bold"}>Ticket State</Form.Label>

                                    <Form.Select id={"StateSelect"} ref={inputState} onChange={e => {changeStateVal(e.currentTarget.value); console.log(e.currentTarget.value);}}>
                                        <option value={"SELECTONE"} >select an option...</option>
                                        <option value={"To Do"}>To Do</option>
                                        {tickStates !== null ?
                                            tickStates.value.map(function (thisState, index) {
                                                return (
                                                    <option key={index} id={thisState.name + "OPTION"}  value={thisState.name}>{thisState.name}</option> );
                                            })
                                            : null}
                                    </Form.Select>

                                </Form.Group>
                            </Row>
                            : null}

                        {/*DUE DATE*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label  htmlFor={"tickDate"} className={"fw-bold d-inline-block"}>Due Date</Form.Label>
                                <Form.Control id={"tickDate"} name={"tickDate"} ref={inputDate} type={"date"} />
                            </Form.Group>
                        </Row>

                        {/*Priority*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label className={"fw-bold"}>Priority</Form.Label>
                                <div className={"d-flex justify-content-start"}>
                                    <Form.Label htmlFor={"tickPriority1"} className={"ms-4 me-2"}>
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
                                        <div id={"contentEditDiv"} ref={divDesc} className={"form-control"}></div>
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
                        <Row className={"mb-3"}>
                            {/*TODO: make this attachment form real*/}
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"tickAttachments"} className={"fw-bold"}>Attachments</Form.Label>
                                <Form.Control id={"tickAttachments"} name={"tickAttachments"} ref={inputAttachment} type={"file"} />
                            </Form.Group>
                        </Row>

                        {/*CONDITIONAL FORMS*/}
                        {props.editTicket !== true?
                            <Row>
                                {anotherDataSource.map((thisSource, index) => (
                                    <div key={index}>
                                        <ConditionalForms />
                                    </div>
                                ))}
                                <Row className={"justify-content-between"}>
                                    <Col xs={6}>
                                        {anotherDataSource.length !== 1 ?
                                            <Button size={"sm"} onClick={lessDataSources} className={"mt-2 ms-3"}>
                                                Remove Source
                                            </Button>
                                            : null}
                                    </Col>
                                    <Col xs={6}>
                                        <Button size={"sm"} onClick={moreDataSources} className={"mt-2 float-end"}>
                                            Add Another Source
                                        </Button>
                                    </Col>
                                </Row>

                            </Row>
                            : null
                        }

                        {/*SUBMIT BUTTONS*/}
                        {props.editTicket === true ?
                            <Button onClick={handleClose} type={"submit"} name={"action"} className={"float-end mt-2"}>
                                Update
                            </Button>
                            :
                            <Button onClick={handleClose} type={"submit"} name={"action"} className={"float-end mt-3"}>
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
