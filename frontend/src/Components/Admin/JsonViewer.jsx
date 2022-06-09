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
    // latest Json changes
    const [data, setData] = useState("");
    // updates CodeMirror value 
    const [jsonDB, setJson] = useState("");
    // copy of the original Json
    const [oldJson, setOldJson] = useState("");
    const [jsonError, setJsonError] = useState("");
    const [show, setShow] = useState(false);

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
                setJson(jsonFromDB);
                setOldJson(jsonFromDB);
                console.log(jsonFromDB);
            })
            .catch((err) => {
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
        setData(data);
        if (oldJson !== data) {
            setChange(false);
        } else {
            setChange(true);
        }
        if (!validate(data)) {
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

    const saveFile = async (string) => {
        const blob = new Blob([string], { type: "application/json" });
        const a = document.createElement("a");
        a.download = "Conditional_Form.json";
        a.href = URL.createObjectURL(blob);
        a.addEventListener("click", () => {
            setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
    };

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
        if (fileUploaded !== undefined) {
            const reader = new FileReader();
            reader.onload = async (event) => {
                console.log("Result: " + event.target.result);
                setJson(event.target.result);
            };
            reader.readAsText(fileUploaded);
        }
        console.log(fileUploaded);
    };

    return (
        <>
            <div className="container mt-4">

                <div className="row">
                    <div className="col-12 text-center mt-2">
                        <p className="adminError">{jsonError}</p>
                    </div>
                </div>

                <div className="row">

                    <div className="col-2 mb-1">

                        <div className="row">

                            <div className="col-12">

                                <Button
                                    onClick={handleShow}
                                    className="btn btn-danger mb-2 adminBtn saveBtn" disabled={change}
                                >
                                    Save
                                </Button>
                            </div>

                            <div className="col-12">

                                <Button
                                    onClick={loadOld}
                                    className="btn btn-primary mb-2 adminBtn"
                                >
                                    Load Original JSON
                                </Button>
                            </div>

                            <div className="col-12">

                                <Button onClick={handleClick} className="btn btn-success mb-2 adminBtn">
                                    Import
                                </Button>

                                <input type="file" accept="application/json" ref={hiddenFileInput} onChange={handleChange} style={{ display: "none" }} />
                            </div>

                            <div className="col-12">
                                <Button
                                    onClick={() => saveFile(data)}
                                    className="btn btn-warning adminBtn"
                                    id="exportbtn"
                                >
                                    Export
                                </Button>
                            </div>

                        </div>

                    </div>


                    <div className="col-10 mx-auto">
                        <CodeMirror
                            className="rounded"
                            value={jsonDB}
                            height="83VH"
                            theme={oneDark}
                            lint="true"
                            gutters={["CodeMirror-lint-markers"]}
                            extensions={[json(), linter(jsonParseLinter())]}
                            onUpdate={viewUpdate => {
                                if (viewUpdate.docChanged) {
                                    const text = viewUpdate.state.doc.toString();
                                    if (text && text !== data) {
                                        verify(text);
                                    }
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
