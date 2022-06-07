import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { ConditionalExample } from "./DataSourceConds";


function ConditionalForms({ index, jsonObj }) {
    const conJSON = ConditionalExample;
    // console.log(conJSON);

    const [showChoices, setChoices] = useState("");
    // const catchItemStuff = (value) => {
    //     let jsonVal = JSON.parse(value);
    //     console.log(jsonVal);
    //     setChoices(jsonVal);
    // };

    /*list of words to scan JSON file for. maybe this should be stored in MongoDB and be mutable by admin?*/
    const keywordList = ["type", "properties", "detail", "choices", "title", "description", "type", "items", "anyOf", "required",
        "uniqueItems", "minItems", "enum"];

    // const getKeywordsList = ["properties", ]

    /*conditional object state. variable set to react component (html-to-react parsing)*/
    /*const [condObject, setCondObject] = useState([]);*/
    const [condObject, setCondObject] = useState(new Map());

    useEffect(() => {
        checkJSON();
    }, []);

    function checkJSON() {
        /*if undefined, use json import. otherwise using props sent by component self calls.*/
        if(jsonObj !== undefined) {
            if(jsonObj === null) {
                console.log("null for now");
            } else if(jsonObj === "CHECKANYOF" || jsonObj === "CHECKITEM") {
                console.log("reached top of select list");
            } else {
                console.log(jsonObj);
                setCondObject(new Map(Object.entries(jsonObj)));
            }
        }
        else {
            setCondObject(new Map(Object.entries(conJSON)));
        }
    }

    const [renderCondObj, setRenderCondObj] = useState(null);

    useEffect(() => {
        console.log(renderCondObj);
    }, [renderCondObj]);

    return (
        <>
            <div key={index}>
                {condObject !== null ?
                    <div>

                        {/*object layer has 'title' object in it?*/}
                        {condObject.get("title") !== undefined ?
                            <h5>{condObject.get("title")}</h5>
                            : null}

                        {/*object layer has 'description' object in it?*/}
                        {condObject.get("description") !== undefined ?
                            <h6>{condObject.get("description")}</h6>
                            : null}

                        {/*object layer has 'properties' object in it?*/}
                        {condObject.get("properties") !== undefined ?
                            <ConditionalForms key={null} jsonObj={condObject.get("properties")} />
                            : null}

                        {/*object layer has 'enrollment_items' object in it?*/}
                        {/*NOTE: this is not a good plan. need to check each 'required' and save a copy of value there, then check that value in each object level. get(requiredvalue) and overwrite required each time*/}
                        {condObject.get("enrollment_items") !== undefined ?
                            <ConditionalForms key={null} jsonObj={condObject.get("enrollment_items")} />
                            : null}

                        {/*object layer has 'choices' object in it?*/}
                        {condObject.get("choices") !== undefined ?
                            <ConditionalForms key={null} jsonObj={condObject.get("choices")} />
                            : null}

                        {/*object layer has 'items' object in it?*/}
                        {condObject.get("items") !== undefined ?
                            /*when get returns array, map array object. otherwise call this component again to return the items key's values*/
                            Array.isArray(condObject.get("items")) ?
                                <div>
                                    <Form.Select key={renderCondObj} defaultValue={"CHECKITEM"} onChange={e => {setRenderCondObj(e.target.value); console.log(e.target.value);}}>
                                        <option value={"CHECKITEM"} disabled>select one...</option>

                                        {condObject.get("items").map((thisOption, index) => (
                                            <option key={"items" + index} value={index} >{thisOption}</option>
                                        ))}

                                    </Form.Select>
                                </div>
                                : <ConditionalForms jsonObj={condObject.get("items")} />

                            : null}

                        {/*object layer has 'anyOf' object in it?*/}
                        {condObject.get("anyOf") !== undefined ?
                            /*when get returns array, map array objects. otherwise call this component again to return the anyOf key's value*/
                            Array.isArray(condObject.get("anyOf")) ?
                                <div>
                                    <Form.Select key={renderCondObj} defaultValue={"CHECKANYOF"} onChange={e => {setRenderCondObj(e.currentTarget.value); console.log(e.currentTarget.value);}}>
                                        <option value={"CHECKANYOF"} disabled>select one...</option>

                                        {condObject.get("anyOf").map((thisOption, index) => (
                                            <option key={"anyOf" + index} value={index} >{thisOption["title"]}</option>
                                        ))}
                                    </Form.Select>
                                    {renderCondObj !== null ? <ConditionalForms jsonObj={condObject.get("anyOf")[renderCondObj]} />
                                        : null}
                                </div>
                                : <ConditionalForms jsonObj={condObject.get("anyOf")} />

                            : null}

                        {/*object layer has 'enum' object in it?*/}
                        {condObject.get("enum") !== undefined ?
                            /*when get returns array, map array objects. otherwise call this component again to return the enum key's value*/
                            Array.isArray(condObject.get("enum")) ?
                                <div>
                                    <Form.Select defaultValue={"CHECKENUM"} onChange={e => {setRenderCondObj(e.currentTarget.value); console.log(e.currentTarget.value);}}>
                                        <option value={"CHECKENUM"} disabled>select one...</option>

                                        {condObject.get("enum").map((thisEnum, index) => (
                                            <option key={"enum" + index} value={index} >{thisEnum}</option>
                                        ))}

                                    </Form.Select>
                                    {renderCondObj !== null ? <ConditionalForms jsonObj={condObject.get("enum")[renderCondObj]} />
                                        : null}
                                </div>
                                : <ConditionalForms jsonObj={condObject.get("enum")} />

                            : null}

                    </div>
                    : null }
            </div>

        </>
    );
}

ConditionalForms.propTypes = {
    index: PropTypes.any,
    jsonObj: PropTypes.object
};

export default ConditionalForms;
