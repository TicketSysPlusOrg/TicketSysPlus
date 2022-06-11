// forms to fill to create a new ticket
import React, { createRef, useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import PropTypes from "prop-types";

import { azureConnection } from "../../index";
import { parseHtml } from "../../utils/Util";

import ConditionalForms from "./ConditionalForms";
import AutoCompleteNames from "./AutoCompleteNames";
import DeleteButton from "./DeleteButton";

function TicketForm(props) {

    /*show and close vars for modal*/
    const handleClose = () => {
        props.setShow ? props.setShow(false) : null;
    };

    /*trigger this to run handleClose after all async calls are completed*/
    const [readyToClose, setReadyToClose] = useState(null);

    useEffect(() => {
        if(readyToClose !== null) {
            console.log("firing close");
            handleClose();
        }
    }, [readyToClose]);

    /*delete ticket*/
    const [deleteTicket, setDeleteTicket] = useState(false);

    /*delete ticket call when deleteTicketId !== null*/
    useEffect(() => {
        if (deleteTicket) {
            const deleteThisTicket = azureConnection.deleteWorkItem(props.ticketInfo.fields["System.AreaPath"], props.ticketInfo.id);
        }
    }, [deleteTicket]);

    /*initialize refs for input value gathering onsubmit*/
    let inputState = createRef();
    let inputTitle = createRef();
    let inputType = createRef();
    let inputDesc = createRef();
    let inputDate = createRef();
    let inputPriority = createRef();
    let inputAttachment = createRef();
    let divDesc = createRef();
    let assignedVal = createRef();
    let mentionsVal = createRef();

    /*prj ID state variable*/
    const [prjID, setprjID] = useState(null);

    /*work item icons*/
    const [icons, setIcons] = useState([]);

    /*TODO: currently set up just to speak with MotorqProject board. admin env controls should set this properly.*/
    useEffect(() => {
        setReadyToClose(null);
        (async () => {
            const projID = await azureConnection.getProjects();
            setprjID(projID.value[1].id);

            const workItemIcons = await azureConnection.getWorkItemTypeIcons();
            setIcons(workItemIcons.value);
        })();
    }, []);

    /*ticket states*/
    const [tickStates, setTickStates] = useState(null);

    useEffect(() => {
        //TODO: admin control of selected state
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

    /*new ticket/edit ticket submission block*/
    async function submitTicket(SubmitEvent) {
        SubmitEvent.preventDefault();

        const ticketTitle = inputTitle.current.value;
        const ticketType = typeVal;
        const ticketDesc = inputDesc.current.value;
        const tickDate = inputDate.current.value;
        const tickPriority = priorityVal;
        const tickAttachments = uploadVal;

        /*handle mentions array for tags*/
        const mentionFormat = "<a href=\"#\" data-vss-mention=\"version2.0,USERID\">@NAME</a>";
        let allMentions = "";
        for (let i = 0; i < mentionChoices.length; i++) {
            allMentions += mentionFormat.replace("USERID", mentionChoices[i].id).replace("NAME", mentionChoices[i].label);
        }

        /*handle assigned person*/
        let assignedPerson = "";
        assignee !== null ? assignedPerson = assignee.label + " <" + assignee.email + ">" : null;

        /*create ticket block*/
        if (!editTicket) {
            /*create new devops ticket*/
            const devOpsTickData = {
                "fields": {
                    "System.State": "To Do",
                    "System.Title": ticketTitle,
                    "System.Description": ticketDesc,
                    "Microsoft.VSTS.Scheduling.DueDate": tickDate,
                    "Microsoft.VSTS.Common.Priority": tickPriority,
                    "System.WorkItemType": ticketType,
                    "Microsoft.VSTS.CMMI.Comments": allMentions,
                    "System.AssignedTo": assignedPerson,
                }
            };
            console.log(devOpsTickData);

            const createTicket = await azureConnection.createWorkItem(prjID, ticketType, devOpsTickData);
            console.log(createTicket);

            await uploadAndAttach(prjID, createTicket.id, tickAttachments);
        }
        /*update ticket block*/
        else {
            let ticketUpdates = {};

            /*check title, type, description, priority, due date, mentions, attachments when it works */
            if (inputTitle.current.value !== props.ticketInfo.fields["System.Title"]) {
                ticketUpdates["System.Title"] = ticketTitle;
            }
            if (priorityVal !== null) {
                ticketUpdates["Microsoft.VSTS.Common.Priority"] = priorityVal;
            }

            if (stateVal !== null && stateVal !== props.ticketInfo.fields["System.State"]) {
                ticketUpdates["System.State"] = stateVal;
            }

            if (typeVal !== null) {
                ticketUpdates["System.WorkItemType"] = typeVal;
            }

            if (inputDate.current.value !== props.ticketInfo.fields["Microsoft.VSTS.Scheduling.DueDate"]) {
                ticketUpdates["Microsoft.VSTS.Scheduling.DueDate"] = inputDate.current.value;
            }

            if (assignedPerson !== undefined && assignedPerson !== "" && assignedPerson !== props.ticketInfo.fields["System.AssignedTo"]) {
                ticketUpdates["System.AssignedTo"] = assignedPerson;
            }

            if (mentionChoices.length > 0) {
                console.log(allMentions);
                ticketUpdates["Microsoft.VSTS.CMMI.Comments"] = allMentions;
            }

            const updateDevopsTickets = { "fields": ticketUpdates };
            const updateTicket = await azureConnection.updateWorkItem(prjID, props.ticketInfo.id, updateDevopsTickets, "fields");
            console.log(updateTicket);
            await uploadAndAttach(prjID, props.ticketInfo.id, tickAttachments);
        }
    }

    /*function for shared info*/
    async function uploadAndAttach(uploadPrjId, uploadWIId, tickAttachmentsArr) {

        for (let i = 0; i < tickAttachmentsArr.length; i++) {
            const createAttachment = await azureConnection.createWorkItemAttachment(uploadPrjId, tickAttachmentsArr[i]);
            console.log(createAttachment);

            const ticketAttachment =
                {
                    "relations": [{
                        "rel": "AttachedFile", "url": createAttachment["url"], "attributes": {
                            "name": tickAttachmentsArr[i]["name"],
                            "type": tickAttachmentsArr[i]["type"],
                            "size": tickAttachmentsArr[i]["size"],
                            "lastModifiedDate": tickAttachmentsArr[i]["lastModifiedDate"]
                        }
                    }]
                };
            console.log(ticketAttachment);

            const uploadAttachmentToWI = await azureConnection.updateWorkItem(uploadPrjId, uploadWIId, ticketAttachment, "relations");
            console.log(uploadAttachmentToWI);
        }
        setReadyToClose("ready");
    }

    /*editTicket state.*/
    const [editTicket, getEditTicketState] = useState(null);

    useEffect(() => {
        getEditTicketState(props.editTicket);
    }, []);

    /*set initial states for forms in edit ticket view*/
    useEffect(() => {
        if (editTicket === true) {

            /*ticket title*/
            inputTitle.current.value = props.ticketInfo.fields["System.Title"];

            /*assigned to*/
            if (props.ticketInfo.fields["System.AssignedTo"] !== undefined && props.ticketInfo.fields["System.AssignedTo"] !== null) {
                changeAssignedTo(props.ticketInfo.fields["System.AssignedTo"]);
            }

            /*ticket type*/
            document.getElementById("tick" + props.ticketInfo.fields["System.WorkItemType"]).checked = true;

            /*ticket state*/
            document.getElementById("StateSelect").value = props.ticketInfo.fields["System.State"];

            /*description*/
            const divDescObjects = props.ticketInfo.fields["System.Description"];
            if (divDescObjects === undefined) {
                divDesc.current.innerHTML = "";
            } else if (typeof divDescObjects === "string") {
                divDesc.current.innerHTML = divDescObjects;
            } else {
                divDesc.current.innerHTML += parseHtml(divDescObjects.props.children);
            }

            /*comments*/

            /*priority*/
            document.getElementById("tickPriority" + props.ticketInfo.fields["Microsoft.VSTS.Common.Priority"]).checked = true;

            //TODO: CHECK DUE DATE FIELD SLICE. this is likely a lazy method and could be shaving time if done improperly
            /*due date*/
            if (props.ticketInfo.fields["Microsoft.VSTS.Scheduling.DueDate"] !== undefined) {
                inputDate.current.value = props.ticketInfo.fields["Microsoft.VSTS.Scheduling.DueDate"].slice(0, 10);
            } else {
                props.ticketInfo.fields = "";
            }

            //TODO: more mentions functionality?
            /*inputMentions.current.value = props.ticketInfo.fields["System.Mentions"];*/
        }
    }, [editTicket]);

    /*trigger more data source forms*/
    let [anotherDataSource, setAnotherDataSource] = useState([0]);

    function moreDataSources() {
        setAnotherDataSource([...anotherDataSource, anotherDataSource.length]);
    }

    function lessDataSources() {
        if (anotherDataSource.length !== 1) {
            let sourceArr = [...anotherDataSource];
            sourceArr.pop();
            setAnotherDataSource(sourceArr);
        }
    }

    /*update statevals, typevals, assignedto, and priorityval onchange. overriding hard set from edit ticket data*/
    const [priorityVal, changePriorityVal] = useState(null);
    const [typeVal, changeTypeVal] = useState(null);
    const [stateVal, changeStateVal] = useState(null);
    const [assignedTo, changeAssignedTo] = useState(null);

    /*array of mentioned people. trying to tag them in created ticket and edited ticket*/
    const [mentionChoices, setMentionChoices] = useState([]);
    /*assigned person*/
    const [assignee, setAssignee] = useState(null);
    /*state for file upload. currently one item at a time*/
    const [uploadVal, setUploadVal] = useState([]);

    /*TODO: need to limit file size, run checks, and add to an array of files for creation*/
    function uploadAttach(thisFile) {
        console.log(thisFile);
        setUploadVal(thisFile);
    }

    function returnWorkItemIcon(iconName) {
        const thisIcon = icons.find(icon => icon.id === iconName);
        return(<img src={thisIcon.url} alt={thisIcon.id + " work item icon"} id={thisIcon.id} className={"iconsize"} />);
    }

    function getDataSourceValues() {
        const returnValues = document.getElementsByClassName("dataSourceValues");
        for (let i = 0; i < returnValues.length; i++) {
            console.log(returnValues[i].textContent);
        }
    }

    return (
        <>
            <Row>
                <Col>
                    {/*TODO: fields for project/teams*/}
                    {/*TODO: validation  for all fields*/}
                    <Form className={"col s12"} onSubmit={submitTicket}>

                        {/*EDIT TICKET HEADER AND DELETE BUTTON. AVAILABLE WHEN IN EDIT TICKET MODE.*/}
                        {editTicket === true ?
                            <Row className={"mb-2"}>
                                <Col xs={10} className={"d-flex align-items-center"}>
                                    <h4>EDITING TICKET</h4>
                                </Col>
                                <Col xs={1} className={"mb-2"}>
                                    <DeleteButton setDeleteTicket={setDeleteTicket}/>
                                </Col>
                                <hr className={"mt-1"}/>
                            </Row>
                            : null}

                        {/*TITLE*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"ticketTitle"} className={"fw-bold"}>TICKET TITLE</Form.Label>
                                <Form.Control aria-required={true} required type={"text"} placeholder={"Enter title"} ref={inputTitle}/>
                                <Form.Text id={"ticketTitle"} name={"ticketTitle"}/>
                            </Form.Group>
                        </Row>

                        {/*TICKET TYPE*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label className={"d-block fw-bold"}>TICKET TYPE</Form.Label>
                                <div className={"ms-4 me-2 d-inline"}>{icons.length !== 0 ? returnWorkItemIcon("icon_crown") : ""}</div>
                                <Form.Label htmlFor={"tickEpic"}>
                                    Epic<Form.Check aria-required={true} required className={"ms-3"} inline name={"tickType"} id={"tickEpic"}
                                        ref={inputType} type={"radio"}
                                        onChange={() => changeTypeVal("Epic")} value={"Epic"}
                                        defaultChecked={null}/>
                                </Form.Label>
                                <div className={"ms-4 me-2 d-inline"}>{icons.length !== 0 ? returnWorkItemIcon("icon_clipboard_issue") : ""}</div>
                                <Form.Label htmlFor={"tickIssue"}>
                                    Issue<Form.Check className={"ms-3"} inline name={"tickType"} id={"tickIssue"}
                                        ref={inputType} type={"radio"}
                                        onChange={() => changeTypeVal("Issue")} value={"Issue"}
                                        defaultChecked={null}/>
                                </Form.Label>
                                <div className={"ms-4 me-2 d-inline"}>{icons.length !== 0 ? returnWorkItemIcon("icon_check_box") : ""}</div>
                                <Form.Label htmlFor={"tickTask"} >
                                    Task<Form.Check className={"ms-3"} inline name={"tickType"} id={"tickTask"}
                                        ref={inputType} type={"radio"}
                                        onChange={() => changeTypeVal("Task")} value={"Task"}
                                        defaultChecked={null}/>
                                </Form.Label>
                            </Form.Group>
                        </Row>

                        {/*TICKET STATE*/}
                        {editTicket === true ?

                            <Row className={"mb-2"}>
                                <Form.Group className={"col s12"}>

                                    <Form.Label className={"d-block fw-bold"}>TICKET STATE</Form.Label>

                                    <Form.Select id={"StateSelect"} ref={inputState} onChange={e => {
                                        changeStateVal(e.currentTarget.value);
                                        console.log(e.currentTarget.value);
                                    }}>
                                        <option value={"SELECTONE"}>select an option...</option>
                                        <option value={"To Do"}>To Do</option>
                                        {tickStates !== null ?
                                            tickStates.value.map(function (thisState, index) {
                                                return (
                                                    <option key={index} id={thisState.name + "OPTION"}
                                                        value={thisState.name}>{thisState.name}</option>);
                                            })
                                            : null}
                                    </Form.Select>

                                </Form.Group>
                            </Row>
                            : null}

                        {/*CURRENT ASSIGNED TO*/}
                        {editTicket ?
                            <Row className={"mb-2"}>
                                <Col>
                                    <label className={"fw-bold form-label"}>CURRENT ASSIGNEE</label>
                                    <div
                                        className={"form-control "}>{assignedTo !== null ? assignedTo : "No assignee!"}</div>
                                </Col>
                            </Row>
                            : null}

                        {/*ASSIGNED TO*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"tickAssigned"}
                                    className={"fw-bold d-inline-block"}>{editTicket === true ? "ASSIGNED TO" : "ASSIGN TO"}</Form.Label>
                                <AutoCompleteNames id={"tickAssigned"} setMentionChoices={setMentionChoices}
                                    setAssignee={setAssignee} singleOrMultiple={""}/>
                            </Form.Group>
                        </Row>

                        {/*DUE DATE*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"tickDate"} className={"fw-bold d-inline-block"}>DUE
                                    DATE</Form.Label>
                                <Form.Control aria-required={true} required id={"tickDate"} name={"tickDate"} ref={inputDate} type={"date"}/>
                            </Form.Group>
                        </Row>

                        {/*Priority*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label className={"fw-bold"}>PRIORITY</Form.Label>
                                <div className={"d-flex justify-content-start"}>
                                    <Form.Label htmlFor={"tickPriority1"} className={"ms-4 me-2"}>
                                        1 <Form.Check aria-required={true} required className={"ms-2"} inline name={"tickPriority"}
                                            id={"tickPriority1"} ref={inputPriority} type={"radio"}
                                            onChange={() => changePriorityVal(1)} value={1}
                                            defaultChecked={null}/>
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickPriority2"} className={"mx-2"}>
                                        2 <Form.Check className={"ms-2"} inline name={"tickPriority"}
                                            id={"tickPriority2"} ref={inputPriority} type={"radio"}
                                            onChange={() => changePriorityVal(2)} value={2}
                                            defaultChecked={null}/>
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickPriority3"} className={"mx-2"}>
                                        3 <Form.Check className={"ms-2"} inline name={"tickPriority"}
                                            id={"tickPriority3"} ref={inputPriority} type={"radio"}
                                            onChange={() => changePriorityVal(3)} value={3}
                                            defaultChecked={false}/>
                                    </Form.Label>
                                    <Form.Label htmlFor={"tickPriority4"} className={"mx-2"}>
                                        4 <Form.Check className={"ms-2"} inline name={"tickPriority"}
                                            id={"tickPriority4"} ref={inputPriority} type={"radio"}
                                            onChange={() => changePriorityVal(4)} value={4}
                                            defaultChecked={null}/>
                                    </Form.Label>
                                </div>
                            </Form.Group>
                        </Row>

                        {/*MENTIONS*/}
                        <Row className={"mb-2"}>
                            <Form.Group className={"col s12"}>
                                <Form.Label htmlFor={"tickMentions"} className={"fw-bold"}>MENTIONS</Form.Label>
                                <AutoCompleteNames id={"tickMentions"} setMentionChoices={setMentionChoices}
                                    setAssignee={setAssignee} singleOrMultiple={"multiple"}/>
                            </Form.Group>
                        </Row>

                        {/*DESCRIPTION*/}
                        <Row className={"mb-2"}>
                            {editTicket === true ?
                                <>
                                    <Container className={"mb-2"}>
                                        <div className={"form-label fw-bold"}>TICKET DESCRIPTION</div>
                                        <div id={"contentEditDiv"} ref={divDesc} className={"form-control"}></div>
                                    </Container>
                                </>
                                : null}
                            <Form.Group className={editTicket === true ? "col s12 d-none" : "col s12"}>
                                <Form.Label htmlFor={"ticketDesc"} className={"fw-bold"}>TICKET DESCRIPTION</Form.Label>
                                <Form.Control as={"textarea"} id={"areaForm"} rows={"2"} type={"text"}
                                    placeholder={"Enter description"} ref={inputDesc}/>
                                <Form.Text id={"ticketDesc"} name={"ticketDesc"}/>
                            </Form.Group>
                        </Row>

                        {/*ATTACHMENTS*/}
                        {props.editTicket ?
                            <Row className={"mb-3"}>
                                <h6 className={"fw-bold"}>CURRENT ATTACHMENTS</h6>
                                {props.ticketInfo.relations ?
                                    props.ticketInfo.relations.map((thisAttachment, index) => {
                                        return(
                                            <Col xs={3} key={index} className={"mx-2"}>
                                                <Card className={"shadow-sm"}>
                                                    <Card.Body>
                                                        <Card.Title title={thisAttachment.attributes.name} className={"text-truncate"}>{thisAttachment.attributes.name}</Card.Title>
                                                        <br />
                                                        <a className={"float-end"} href={thisAttachment.url + "?fileName=" + thisAttachment.attributes.name + "&content-disposition=attachment"} download>Download</a>
                                                    </Card.Body>
                                                </Card>
                                            </Col>); } )
                                    : <p>No current attachments.</p>}
                            </Row>
                            : null}

                        <Row className={"mb-3"}>
                            <Form.Group className={"col s12 d-block"}>
                                <Form.Label htmlFor={"tickAttachments"} className={"fw-bold"}>ATTACHMENTS</Form.Label>
                                <Form.Control multiple id={"tickAttachments"} name={"tickAttachments"}
                                    ref={inputAttachment} onChange={e => uploadAttach(e.target.files)}
                                    type={"file"}/>
                            </Form.Group>
                        </Row>

                        {/*CONDITIONAL FORMS*/}
                        {props.editTicket !== true ?
                            <Row>
                                {anotherDataSource.map((thisSource, index) => (
                                    <div key={index} className={"dataSourceValues"} onChange={getDataSourceValues}>
                                        <Container key={index}>
                                            <ConditionalForms index={index} />
                                        </Container>
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
                            <Button type={"submit"} name={"action"} className={"float-end mt-2"}>
                                UPDATE
                            </Button>
                            :
                            <Button type={"submit"} name={"action"}
                                className={"float-end mt-3"}>
                                SUBMIT
                            </Button>
                        }

                    </Form>
                </Col>

            </Row>
        </>
    );

}

TicketForm.propTypes = {
    editTicket: PropTypes.bool,
    ticketInfo: PropTypes.object,
    setShow: PropTypes.func
};

export default TicketForm;
