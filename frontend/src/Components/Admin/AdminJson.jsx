import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

import { backendApi } from "../../index";

import JsonForm from "./JsonForm";
import JsonViewer from "./JsonViewer";

function AdminJson() {
    const [json, setJson] = useState("");
    const [change, setChange] = useState(true);
    const [data, setData] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        run();
    }, []);

    function run() {
        backendApi.get("jsons")
            .then((res) => {
                const dbJson = res.data[0].body;
                document.getElementById("jsonText").value = dbJson;
                setJson(dbJson);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function validate(jsonToValidate) {
        let isValid = false;
        //check for valid JSON format
        try {
            const tempJSON = JSON.parse(jsonToValidate);
            isValid = true;
            document.getElementById("error").innerHTML = " ";
        } catch (error) {
            console.log("Invalid JSON Format");
            document.getElementById("error").innerHTML = error.message;
        }
        return isValid;
    }

    function verify() {
        const jsonText = document.getElementById("jsonText").value;

        {/*TODO: && if schema is valid*/ }
        if (jsonText !== json) {

            if (validate(jsonText)) {
                setChange(false);
                setData(jsonText);
            }

        }
        else {
            setChange(true);
            document.getElementById("error").innerHTML = " ";
        }
    }

    function loadOld() {
        backendApi
            .get("jsons")
            .then((res) => {
                //TODO: setCurrentJson should be the body of the db data from the get
                console.log(res.data);
                document.getElementById("jsonText").value = res.data[0].body;
                verify();
            })
            .catch((err) => {
                console.log(err);
            });
    }
    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef(null);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        console.log(fileUploaded);
    };

    return (
        <>
            <div className="row">
                <div className="col-12 text-center mt-2">
                    <p className="text-danger error" id="error">  </p>
                </div>
            </div>

            <div className="row align-items-center justify-content-center mt-2">
                <div className="col-7 d-flex mb-1">

                    <button onClick={handleShow} className="btn btn-danger mx-3" id="savebtn" type="button" disabled={change}>Save</button>

                    <button onClick={() => loadOld()} className="btn btn-danger mx-3" id="oldbtn" type="button">Load Old Json Schema</button>
                    <Button onClick={handleClick}>
                        Upload a file
                    </Button>
                    <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: "none" }} />
                    <button className="btn btn-danger mx-3" id="exportbtn" type="button">Export</button>
                </div>


                <div className="col-7 text-center border border-3 border-info p-3 bg-white shadow-lg mb-5">
                    <textarea onChange={() => verify()} style={{ height: "400px" }} name="ticketData" id={"jsonText"} className="text-wrap text-break w-100">
                    </textarea>
                </div>
            </div>

            <div className="container">
                <p>code mirror below...</p>
                <JsonViewer jsonM />
            </div>

            <Modal show={show} onHide={handleClose} className="row">
                <div className="col-12">
                    <Modal.Dialog className="shadow-lg my-0">

                        <Modal.Header closeButton>
                            <Modal.Title className="text-success">Save JSON</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <JsonForm jsonModal={data} />
                        </Modal.Body>
                    </Modal.Dialog>
                </div>
            </Modal>
        </>
    );

}

export default AdminJson;
