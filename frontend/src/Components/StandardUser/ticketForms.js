// forms to fill to create a new ticket
import React, { createRef, useState } from "react";
import axios from "axios";
import {Button} from "react-bootstrap";

//TODO: make react-bootstrap friendly.
//TODO: use the array inputs properly.
function TicketForm() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    let inputTitle = createRef();
    let inputDesc = createRef();
    let inputDate = createRef();
    let inputPriority = createRef();
    let inputMentions = createRef();
    let inputAttachment = createRef();


    function submitTicket(SubmitEvent)
    {
        //TODO: stop reload of page but close out the modal
        /*SubmitEvent.preventDefault();*/

        const ticketTitle = inputTitle.current.value;
        const ticketDesc = inputDesc.current.value;
        const tickDate = inputDate.current.value;
        const tickPriority = inputPriority.current.value;
        const tickMentions = inputMentions.current.value;
        const tickAttachments = inputAttachment.current.value;

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
            <div className="row">
                <div className="col ">
                    {/*<h1 className="center">Add a New Ticket</h1>*/}
                    {/*TODO: validation  for all fields*/}
                    <form className="col s12" onSubmit={submitTicket}>
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="ticketTitle">Ticket Title</label>
                                <input id="ticketTitle" ref={inputTitle} type="text" />
                            </div>
                            <div className="input-field col s6">
                                <label htmlFor="ticketDesc">Ticket Description</label>
                                <input id="ticketDesc" ref={inputDesc} type="text" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="tickDate">Due Date</label>
                                <input id="tickDate" ref={inputDate} type="text" />
                            </div>
                            <div className="input-field col s6">
                                <label htmlFor="tickPriority">Priority</label>
                                <input id="tickPriority" ref={inputPriority} type="text" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s6">
                                <label htmlFor="tickMentions">Mentions</label>
                                <input id="tickMentions" ref={inputMentions} type="text" />
                            </div>
                            <div className="input-field col s6">
                                <label htmlFor="tickAttachments">Attachments</label>
                                <input id="tickAttachments" ref={inputAttachment} type="text" />
                            </div>
                        </div>
                        {/*<button*/}
                        {/*    className="btn waves-effect waves-light btn btn-success float-end mt-2"*/}
                        {/*    type="submit"*/}
                        {/*    name="action"*/}
                        {/*>*/}
                        {/*    Create Ticket*/}
                        {/*</button>*/}
                        <Button variant="primary" onClick={handleClose} type="submit" name="action" className="waves-effect waves-light float-end mt-2">
                                    Create Ticket
                        </Button>
                    </form>


                </div>

            </div>
        </>
    );

}

export default TicketForm;
