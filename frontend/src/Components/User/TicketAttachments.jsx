import { Card, Col } from "react-bootstrap";
import React from "react";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * The TicketAttachments component handles mapping/displaying work item-associated attachments.
 * @param {props} ticketInfo the DevOps work item info containing all related attachments.
 * @returns {JSX.Element} TicketAttachments component.
 */
function TicketAttachments({ ticketInfo }) {

    return (
        <>
            {ticketInfo.relations.map((thisAttachment, index) => {
                return(
                    <Col xs={4} key={index} className={"my-2"}>
                        <Card className={"shadow-sm"}>
                            <Card.Body>
                                <Card.Title title={thisAttachment.attributes.name} className={"text-truncate"}>{thisAttachment.attributes.name}</Card.Title>
                                <br />
                                <a className={"float-end"} href={thisAttachment.url + "?fileName=" + thisAttachment.attributes.name + "&download=true"} download>Download</a>
                            </Card.Body>
                        </Card>
                    </Col>); } ) }
        </>
    );
}

export default TicketAttachments;
