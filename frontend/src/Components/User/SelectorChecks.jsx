import {Form, Row} from "react-bootstrap";
import React from "react";


function SelectorChecks({ setRowValue, rowValue }) {

    return (
        <>
            <Row className={"my-2"}>
                <h6 className={"fw-bold my-3"}>Comment and Attachment Displays</h6>
                <Form>
                    <div className={"d-flex justify-content-start"}>
                        <Form.Label htmlFor={"commentSelect"} className={"ms-4 me-2"}>
                            Comments <Form.Check className={"ms-2"} type={"radio"} id={"commentCheck"} inline name={"seeChecks"} value={"comments"} defaultChecked onChange={e => setRowValue(e.currentTarget.value)}/>
                        </Form.Label>
                        <Form.Label htmlFor={"attachSelect"} className={"mx-2"}>
                            Attachments <Form.Check className={"ms-2"} type={"radio"} id={"attachSelect"} inline name={"seeChecks"} value={"attachments"} onChange={e => setRowValue(e.currentTarget.value)}/>
                        </Form.Label>
                    </div>
                </Form>
            </Row>
        </>
    );
}

export default SelectorChecks;
