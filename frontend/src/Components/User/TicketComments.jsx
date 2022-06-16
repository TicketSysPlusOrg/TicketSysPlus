import { Card, Col, Button } from "react-bootstrap";
import React, { useState } from "react";

import { parseHtml } from "../../utils/Util";
import { azureConnection } from "../../index";

/**
 * This function maps all work item comments and created cards of them.
 * @param {Object} ticketInfo JSON object with all the related work item info
 * @param {array} workItemComments comments associated with work item
 * @returns {JSX.Element} TicketComments object
 */
function TicketComments({ ticketInfo, workItemComments }) {
    /*set state to display single ticket information*/
    const [singleComment, setSingleComment] = useState(null);

    /*get all the chosen ticket's info for display*/
    async function getSingleComment(commentID) {
        const getComment = await azureConnection.getWorkItemComments(ticketInfo.fields["System.AreaPath"], ticketInfo.id, "/" + commentID);
        console.log(getComment);
        setSingleComment(getComment);
    }

    return (
        <>
            {singleComment === null ?
                workItemComments ?
                    workItemComments.comments.map((thisComment, commentIndex) => {
                        return(
                            <Col xs={4} key={commentIndex} className={"my-2"}>
                                <Card className={"shadow-sm"}>
                                    <Card.Header as="h5">
                                        {thisComment.createdDate.slice(0, 10)} <img alt={"author icon"} src={thisComment.createdBy.imageUrl} className={"float-end"} />
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title title={thisComment.createdBy.displayName} className={"text-truncate"}>
                                            {thisComment.createdBy.displayName}
                                        </Card.Title>
                                        <div className={"lineClamp"}>
                                            {parseHtml(thisComment.text)}
                                        </div>
                                        <Button size={"small"} className={"float-end mt-2"} variant={"outline-primary"} type={"button"}
                                            onClick={() => getSingleComment(thisComment.id) }>VIEW</Button>
                                    </Card.Body>
                                </Card>
                            </Col>); } )
                    : <p>No ticket comments available.</p>
                :
                singleComment ?
                    <Col className={"mt-3"}>
                        <Card className={"shadow-sm"}>
                            <Card.Header as="h5">
                                Comment Date: {singleComment.createdDate.slice(0, 10)} <img alt={"author icon"} src={singleComment.createdBy.imageUrl} className={"float-end"} />
                            </Card.Header>
                            <Card.Body>
                                <Card.Title title={singleComment.createdBy.displayName} className={"text-truncate"}>
                                    Created By:{singleComment.createdBy.displayName}
                                </Card.Title>
                                <div>
                                    {parseHtml(singleComment.text)}
                                </div>
                                <Button className={"float-end mt-2"} variant={"outline-primary"} type={"button"}
                                    onClick={() => setSingleComment(null)}>CLOSE</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    : <p>Error loading comment.</p>
            }
        </>
    );
}

export default TicketComments;
