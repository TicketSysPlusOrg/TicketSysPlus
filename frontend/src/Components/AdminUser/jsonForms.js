// forms to fill to create a new ticket
import React, { createRef, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

function JsonForm({ jsonModal }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    let inputBody = createRef();

    function submitJson(SubmitEvent) {

        const jsonBody = inputBody.current.value;

        axios.delete("http://localhost:4001/jsons")
            .then((res) => {
                console.log(res);

            })
            .catch((err) => {
                console.log(err);
            });

        axios.post("http://localhost:4001/jsons", {
            body: jsonBody
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
                <div className="col">

                    {/*TODO: validation  for all fields*/}
                    <Form className="col s12" onSubmit={submitJson}>
                        {/*Will output JSON file here*/}
                        <div className="row mb-2">
                            <Form.Group className="col 6">
                                <Form.Label htmlFor="jsonBody">JSON body</Form.Label>
                                <Form.Control as="textarea" rows={14} type="text" value={jsonModal} ref={inputBody} readOnly={true} />
                                <Form.Text id="jsonBody" name="jsonBody" />
                            </Form.Group>
                        </div>

                        <Button onClick={handleClose} type="submit" name="action" className="float-end mt-2">
                            Submit
                        </Button>
                    </Form>

                </div>

            </div>
        </>
    );

}

export default JsonForm;
