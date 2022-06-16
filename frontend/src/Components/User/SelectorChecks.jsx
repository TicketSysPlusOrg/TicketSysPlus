import { Form, Row } from "react-bootstrap";
import React from "react";

/**
 * This component contains radio selectors for displaying comments, attachments, or neither.
 * @param {props} setRowValue the parent state handler that enables setting the proper state when radio buttons are selected
 * @returns {JSX.Element} SelectorChecks
 */
function SelectorChecks({ setRowValue }) {
    return (
        <>
            <Row className={"my-2"}>
                <h5 className={"my-3"}>View Comments or Attachments</h5>
                <div>
                    <div className={"d-flex justify-content-start"}>
                        <Form.Label htmlFor={"commentSelect"} className={"ms-4 me-2"}>
                            Hide All <Form.Check className={"ms-2"} type={"radio"} id={"none"} inline name={"seeChecks"} value={"none"} defaultChecked onChange={e => setRowValue(e.currentTarget.value)}/>
                        </Form.Label>
                        <Form.Label htmlFor={"commentSelect"} className={"ms-4 me-2"}>
                            Comments <Form.Check className={"ms-2"} type={"radio"} id={"commentCheck"} inline name={"seeChecks"} value={"comments"} onChange={e => setRowValue(e.currentTarget.value)}/>
                        </Form.Label>
                        <Form.Label htmlFor={"attachSelect"} className={"mx-2"}>
                            Attachments <Form.Check className={"ms-2"} type={"radio"} id={"attachSelect"} inline name={"seeChecks"} value={"attachments"} onChange={e => setRowValue(e.currentTarget.value)}/>
                        </Form.Label>
                    </div>
                </div>
            </Row>
        </>
    );
}

export default SelectorChecks;
