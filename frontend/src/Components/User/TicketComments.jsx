import {Card, Col} from "react-bootstrap";
import {parseHtml} from "../../utils/Util";
import React from "react";

/**
 * This function maps all work item comments and created cards of them.
 * @param {array} workItemComments comments associated with work item
 * @returns {JSX.Element} TicketComments object
 */
function TicketComments({workItemComments}) {
    return (
        <>
            {workItemComments ?
                workItemComments.comments.map((thisComment, commentIndex) => {
                    return(
                        <Col xs={4} key={commentIndex} className={"my-2"}>
                            <Card className={"shadow-sm"}>
                                <Card.Body>
                                    <Card.Title title={thisComment.createdBy.displayName} className={"text-truncate"}>
                                        Author: <br />{thisComment.createdBy.displayName} <img alt={"author icon"} src={thisComment.createdBy.imageUrl} />
                                    </Card.Title>
                                    <Card.Text>
                                        {parseHtml(thisComment.text)}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>); } )
                : <p>No ticket comments available.</p>}
        </>
    );
}

export default TicketComments;
