// forms to fill to create a new ticket
import React, { createRef, useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";

function JsonForm({ jsonModal }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    let inputTitle = createRef();
    let inputBody = createRef();

    function submitJson(SubmitEvent) {

        const jsonTitle = inputTitle.current.value;
        const jsonBody = inputBody.current.value;

        axios.delete("https://backend.granny.dev/jsons")
            .then((res) => {
                console.log(res);

            })
            .catch((err) => {
                console.log(err);
            });

        axios.post("https://backend.granny.dev/jsons", {
            title: jsonTitle,
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
                <div className="col ">

                    {/*TODO: validation  for all fields*/}
                    <Form className="col s12" onSubmit={submitJson}>
                        <div className="row mb-2">
                            <Form.Group className="col s6">
                                <Form.Label htmlFor="jsonTitle">JSON Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter title" ref={inputTitle} />
                                <Form.Text id="jsonTitle" name="jsonTitle" />
                            </Form.Group>
                        </div>

                        {/*Will output JSON file here*/}
                        <div className="row mb-2">
                            <Form.Group className="col s6">
                                <Form.Label htmlFor="jsonBody">JSON body</Form.Label>
                                <Form.Control as="textarea" rows="2" type="text" value={jsonModal} ref={inputBody} readOnly={true} />
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
