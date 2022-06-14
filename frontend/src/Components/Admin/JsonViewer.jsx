import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { linter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import PropTypes from "prop-types";
import { Button, Modal, Container } from "react-bootstrap";

import { backendApi } from "../../index";

import JsonForm from "./JsonForm";


function JsonViewer({ isAdmin }) {

    const [change, setChange] = useState(true);
    // latest Json changes
    const [data, setData] = useState("");
    // updates CodeMirror value 
    const [jsonDB, setJsonDB] = useState("");
    // copy of the original Json
    const [currentJson, setCurrentJson] = useState("");
    const [jsonCollection, setJsonCollection] = useState([]);
    // copy of whole collection array of jsons ([0] being current, [1] being previous)
    const [oldJson, setOldJson] = useState("");
    // copy of previous json
    const [jsonError, setJsonError] = useState("");
    // error to display if codemirror finds syntax error
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // save modal display value

    const regex = new RegExp("at position (\\d+)$");


    useEffect(() => {
        run();
    }, []);

    function run() {
        backendApi.get("jsons")
            .then((res) => {
                const currentFromDB = res.data[0]?.body;
                const oldFromDB = res.data[1]?.body;

                // if first index is undefined, then the database is empty.
                // there needs to be two
                // adds two empty items
                if (currentFromDB === undefined) {
                    backendApi.post("jsons", { body: "" })
                        .then((res) => {
                            console.log(res);
                            setJsonDB(res.data);
                            backendApi.post("jsons", { body: "" })
                                .then((res2) => {
                                    console.log(res2);
                                    setJsonCollection([res.data, res2.data]);
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    // if second index is undefined, then there's only one item in the database
                    // there needs to be two
                } else if (oldFromDB === undefined) {
                    backendApi.post("jsons", { body: "" })
                        .then((res) => {
                            setOldJson(res.data);
                            setJsonCollection([jsonCollection[0], res.data]);
                            console.log(res);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    // there are the appropriate amount of items
                } else {
                    setJsonDB(currentFromDB);
                    // sets the json that codemirror will test against
                    setCurrentJson(currentFromDB);
                    // sets the json that codemirror will display initially
                    setOldJson(oldFromDB);
                    // sets the previous json file that was the last iteration
                    setJsonCollection(res.data);
                    // sets the whole json collection
                }

                //console.log(jsonFromDB);
            })
            .catch((err) => {
                console.error(err);
            });
        if (!isAdmin) {
            setChange(true);
            setJsonError("Not a registered admin.");
            return;
        } else {
            setJsonError("");
        }
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

    // checks if the json data from codemirror has been altered and validated
    // enables save button if json from codemirror is valid and verified
    function verify(data) {
        setData(data);
        if (jsonDB !== data) {
            setChange(false);
        } else {
            setChange(true);
        }
        if (!validate(data)) {
            setChange(true);
        }
    }

    // loads previous iteration json from database collection to codemirror
    // verifies loaded json
    function loadOld() {

        backendApi
            .get("jsons")
            .then((res) => {
                setCurrentJson(res.data[1].body);
                verify();
            })
            .catch((err) => {
                console.log(err);
            });
        setCurrentJson(oldJson.data);
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
                setJsonDB(event.target.result);
            };
            reader.readAsText(fileUploaded);
        }
        console.log(fileUploaded);
    };

    return (
        <>
            <div className="container mt-4">

                {/*Codemirror error display*/}
                <div className="row">
                    <div className="col-12 text-center mt-2">
                        <p className="adminError">{jsonError}</p>
                    </div>
                </div>

                <div className="row">

                    <div className="col-2 mb-1">
                        {/*Buttons Save, Load Previous, Import, Export */}
                        <div className="row">

                            <div className="col-12">

                                <Button
                                    onClick={handleShow}
                                    className="btn btn-danger mb-2 adminBtn saveBtn"
                                    disabled={change}
                                >
                                    Save
                                </Button>
                            </div>

                            <div className="col-12">

                                <Button
                                    disabled={!isAdmin}
                                    onClick={loadOld}
                                    className="btn btn-primary mb-2 adminBtn"
                                >
                                    Load Previous JSON
                                </Button>
                            </div>

                            <div className="col-12">

                                <Button
                                    disabled={!isAdmin}
                                    onClick={handleClick}
                                    className="btn btn-success mb-2 adminBtn"
                                >
                                    Import
                                </Button>

                                <input type="file" accept="application/json" ref={hiddenFileInput} onChange={handleChange} style={{ display: "none" }} />
                            </div>

                            <div className="col-12">
                                <Button
                                    disabled={!isAdmin}
                                    onClick={() => saveFile(data)}
                                    className="btn btn-warning adminBtn"
                                    id="exportbtn"
                                >
                                    Export
                                </Button>
                            </div>

                        </div>

                    </div>

                    {/*Codemirror which updates data on change */}
                    <div className="col-10 mx-auto">
                        <CodeMirror
                            readOnly={!isAdmin}
                            value={currentJson}
                            height="75VH"
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
            {/*Modal which displays on Save button click and displays the json from Codemirror before finally submitting
                to the database*/}
            <Modal show={show} onHide={handleClose} className="row">
                <div className="col-12">
                    <Modal.Dialog className="shadow-lg my-0">

                        <Modal.Header closeButton>
                            <Modal.Title className="text-success">Save JSON</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            {/*Passes Codemirror json data, the json Collection, and Modal useEffect method as props
                                to the JsonForm component*/}
                            <JsonForm jsonModal={data} jsonObjects={jsonCollection} setShow={setShow} />
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
