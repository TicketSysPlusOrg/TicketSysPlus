import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { linter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import PropTypes from "prop-types";
import { Button, Modal, Container } from "react-bootstrap";

import { backendApi } from "../../index";

import JsonForm from "./JsonForm";


function JsonViewer() {

    const [change, setChange] = useState(true);
    const [data, setData] = useState("");
    const [show, setShow] = useState(false);
    const [jsonDB, setJson] = useState("");
    const [jsonError, setJsonError] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const regex = new RegExp("at position (\\d+)$");


    useEffect(() => {
        run();
    }, []);

    function run() {
        backendApi.get("jsons")
            .then((res) => {
                const jsonFromDB = res.data[0].body;
                //document.getElementById("jsonText").value = jsonFromDB;
                setJson(jsonFromDB);
                console.log(jsonFromDB);
            })
            .catch((err) => {
                //console.log(err);
                console.error(err);
            });
    }

    function validate(jsonToValidate) {
        let isValid = true;
        //check for valid JSON format
        try {
            JSON.parse(jsonToValidate);
            setJsonError("");
        } catch (error) {
            if (!(error instanceof SyntaxError)) throw error;

            let output = error.message;
            // turn character count into line count
            if (regex.test(error.message)) {
                const regExec = regex.exec(error.message);
                if (regExec !== null) {
                    const position = parseFloat(regExec[1]);
                    const line = jsonToValidate.slice(0, position).split("\n").length;
                    output = error.message.replace(regex, "on line " + line);
                }
            }
            setJsonError(output);
            isValid = false;
        }
        return isValid;
    }

    function verify(data) {
        if (jsonDB !== data) {
            // console.log("Found changes, can save.");
            setChange(false);
        } else {
            setChange(true);
        }
        if (!validate(data)) {
            // console.log("Found an error, can not save.");
            setChange(true);
        }
    }

    function loadOld() {
        backendApi
            .get("jsons")
            .then((res) => {
                //TODO: setCurrentJson should be the body of the db data from the get
                console.log(res.data);
                setJson(res.data[0].body);
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
            <div className="container">

                <div className="row">
                    <div className="col-12 text-center mt-2">
                        <p className="text-danger">{jsonError}</p>
                    </div>
                </div>


                <div className="row align-items-center justify-content-center mt-2">
                    <div className="col-12 d-flex mb-1 mx-auto">

                        <button onClick={handleShow} className="btn btn-danger mx-3" id="savebtn" type="button" disabled={change}>Save</button>

                        <button onClick={() => loadOld()} className="btn btn-danger mx-3" id="oldbtn" type="button">Load Old Json Schema</button>
                        <Button onClick={handleClick}>
                            Upload a file
                        </Button>
                        <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: "none" }} />
                        <button className="btn btn-danger mx-3" id="exportbtn" type="button">Export</button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <CodeMirror
                            value={jsonDB}
                            height="100%"
                            theme={oneDark}
                            lint={true}
                            gutters={["CodeMirror-lint-markers"]}
                            extensions={[json(), linter(jsonParseLinter(), { tooltipFilter: jsonParseLinter() })]}
                            onUpdate={viewUpdate => {
                                if (viewUpdate.state.doc !== undefined) {
                                    const text = viewUpdate.state.doc.toString();
                                    verify(text ? text : "");
                                }
                            }}
                        />
                    </div>
                </div>

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

JsonViewer.propTypes = {
    jsonModal: PropTypes.string
};

export default JsonViewer;
