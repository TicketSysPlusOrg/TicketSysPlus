import { Card, Col } from "react-bootstrap";
import React from "react";


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
