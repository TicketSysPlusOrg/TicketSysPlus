import {Card, Col, Button} from "react-bootstrap";
import {parseHtml} from "../../utils/Util";
import React, {useEffect, useState} from "react";
import {azureConnection} from "../../index";

/**
 * This function maps all work item comments and created cards of them.
 * @param {Object} ticketInfo JSON object with all the related work item info
 * @param {array} workItemComments comments associated with work item
 * @returns {JSX.Element} TicketComments object
 */
function TicketComments({ ticketInfo, workItemComments}) {
    const [singleComment, setSingleComment] = useState(null);

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
                                        <Card.Text className={"lineClamp"}>
                                            {parseHtml(thisComment.text)}
                                        </Card.Text>
                                        <Button size={"small"} className={"float-end"} variant={"outline-primary"} t
                                            type={"button"} onClick={() => getSingleComment(thisComment.id) }>VIEW</Button>
                                    </Card.Body>
                                </Card>
                            </Col>); } )
                    : <p>No ticket comments available.</p>
                :
                singleComment ?
                    <Col className={"mt-3"}>
                        <Card className={"shadow-sm"}>
                            <Card.Header as="h5">
                                {singleComment.createdDate.slice(0, 10)} <img alt={"author icon"} src={singleComment.createdBy.imageUrl} className={"float-end"} />
                            </Card.Header>
                            <Card.Body>
                                <Card.Title title={singleComment.createdBy.displayName} className={"text-truncate"}>
                                    {singleComment.createdBy.displayName}
                                </Card.Title>
                                <Card.Text >
                                    {parseHtml(singleComment.text)}
                                </Card.Text>
                                <Button className={"float-end"} variant={"outline-primary"} t
                                    type={"button"} onClick={() => setSingleComment(null)}>CLOSE</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    : <p>Error loading comment.</p>
            }

        </>
    );
}

export default TicketComments;
