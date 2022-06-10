// forms to fill to create a new ticket
import React, { createRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { backendApi } from "../../index";

function JsonForm({ jsonModal, jsonObjects }) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    let inputBody = createRef();

    function submitJson(event) {
        event.preventDefault();

        jsonObjects[1].body = jsonObjects[0].body;
        jsonObjects[0].body = inputBody.current.value;
        console.log(jsonObjects[0].body);
        backendApi.put("jsons", jsonObjects[0])
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
        backendApi.put("jsons", jsonObjects[1])
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

                        <Button onClick={handleClose} type="submit" className="float-end mt-2">
                            Submit
                        </Button>
                    </Form>

                </div>

            </div>
        </>
    );

}

JsonForm.propTypes = {
    jsonModal: PropTypes.string
};

export default JsonForm;
