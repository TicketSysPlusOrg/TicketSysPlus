import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import PropTypes from "prop-types";

import { ConditionalExample } from "./DataSourceConds";

/*
 * INDEX: the key from the ticketForm array that called conditionalForms component. use it to distinguish conditionalForms iterations and to distinguish list choices
 * JSONOBJ: the object to be sent in on conditional renders. use it to map out the 'layer' of the json file that we're at.
 * KEY: this could be used to pass down a value gotten from "required" key in object layer. may need to use to iterate deeper.
 * */
function ConditionalForms({ index, jsonObj, key }) {
    /*TODO: this is the current dummy json file. need to pull the active JSON from database*/
    const conJSON = ConditionalExample;
    const [renderCondObj, setRenderCondObj] = useState(null);

    /*list of words to scan JSON file for. maybe this should be stored in MongoDB and be mutable by admin?*/
    const keywordList = ["type", "properties", "detail", "choices", "title", "description", "type", "items", "anyOf", "required",
        "uniqueItems", "minItems", "enum"];

    /*
    * each time ConditionalForms is rendered, map the new layer of key/val pairs
    * */
    const [condObject, setCondObject] = useState(new Map());

    /*on-render useEffect*/
    useEffect(() => {
        checkJSON();
    }, []);

    /*if jsonObj is undefined, use json import to kick off conditionals.
        otherwise using props sent by component self calls.*/
    function checkJSON() {
        if(jsonObj !== undefined) {

            if(jsonObj === null) {
                console.log("null for now");
            }
            else if(jsonObj === "CHECKANYOF" || jsonObj === "CHECKITEM" || jsonObj === "CHECKCHOICE") {
                console.log("reached top of select list");
            }
            else {
                console.log(jsonObj);
                setCondObject(new Map(Object.entries(jsonObj)));
            }
        }
        else {
            setCondObject(new Map(Object.entries(conJSON)));
        }
    }
    /*console log to see whenever renderCondObj is changed*/
    useEffect(() => {
        console.log(condObject);
    }, [condObject]);

    {/*
    *
    * CHECK TITLE AND DESCRIPTION FIRST, RENDER THINGS BASED ON THAT.
    * AFTER THIS, CHECK TO SEE IF REQUIREDVAL STATE IS EMPTY OR NOT.
    *   IF NOT EMPTY, CHECK JSON LAYER AGAINST ANYTHING IT CONTAINS.
    *   IF FIND A DEFINED VAL AGAINST ANY KEY IN REQUIREDVAL, RENDER NEW COMPONENT AND SET REQUIREDVAL TO NULL.
    * THEN CHECK REQUIRED. IF 'REQUIRED' NOT RETURNING UNDEFINED, SAVE VAL IN 'REQUIRED VAL' STATE TO BE USED FOR CHECKING THE 'NEXT' CHILD CONDITIONAL FORMAT COMPONENT.
    * THEN CHECK PROPERTIES. IF 'PROPERTIES' NOT RETURNING UNDEFINED, RENDER NEW COMPONENT AND PASS ON ANYTHING THAT MAY BE IN REQUIREDVAL.
    * THEN CHECK AGAINST ITEMS, CHOICES, ENUM, AND ANYOF (NOT NECESSARILY IN THAT ORDER).
    *   IF ANY OF THOSE ARE CONTAINED, SEE IF WHAT THEY RETURN IS AN ARRAY OR NOT.
    *       IF IT'S AN ARRAY, IS IT AN ARRAY OF OBJECTS OR ARRAY OF STRINGS?
    *           IF ARRAY OF OBJECTS (KEY-VAL PAIRS), SELECT LIST GENERATION
    *           IF ARRAY OF STRING/NUMBER/MAYBE BOOLEAN, WE'VE REACHED AN END POINT.
    * *****FOR NOW: ONCE REACHING THIS END POINT, SINGLE SELECT SHOULD SUFFICE. IDEALLY, WE NEED MULTISELECT. *****
    *
    */
    }

    return (
        <>
            <div key={index}>
                {condObject !== null ?
                    <div>

                        {/*object layer has 'title' in it? h5*/}
                        {condObject.get("title") !== undefined ?
                            <h5>{condObject.get("title")}</h5>
                            : null}

                        {/*object layer has 'description' in it? h6*/}
                        {condObject.get("description") !== undefined ?
                            <h6>{condObject.get("description")}</h6>
                            : null}

                        {/*object layer has 'properties' key in it?*/}
                        {condObject.get("properties") !== undefined ?
                            condObject.get("required") !== undefined ?
                                <ConditionalForms index={index} jsonObj={condObject.get("properties")[condObject.get("required")]} />
                                : <ConditionalForms index={index} jsonObj={condObject.get("properties")} />
                            : null}

                        {/*TODO: reduce code. choices, items, and anyOf are quite similar. could make a separate component.*/}
                        {/*ALSO: think about what other base choice types there may be. string, enum, number, boolean...?*/}
                        {/*object layer has 'choices' key in it?*/}
                        {condObject.get("choices") !== undefined ?
                            /*when .get returns array, map array object. otherwise call this component again to return the items key's values*/
                            Array.isArray(condObject.get("choices")) ?
                                <div>
                                    <Form.Select key={renderCondObj} aria-required={true} required defaultValue={"CHECKCHOICE"} onChange={e => {setRenderCondObj(e.target.value); console.log(e.target.value);}}>
                                        {condObject.get("choices").map((choiceOption, choiceIndex) => (
                                            (choiceIndex === 0 ?
                                                <>
                                                    <option value={"CHECKCHOICE"} disabled>select one...</option>
                                                    <option key={"choices" + choiceIndex} value={choiceOption} >{choiceOption}</option>
                                                </>
                                                : <option key={"choices" + choiceIndex} value={choiceOption} >{choiceOption}</option>)
                                        ))}

                                    </Form.Select>
                                </div>
                                : <ConditionalForms index={index} jsonObj={condObject.get("choices")} />

                            : null}

                        {/*object layer has 'items' key in it?*/}
                        {condObject.get("items") !== undefined ?
                            /*when .get returns array, map array object. otherwise call this component again to return the items key's values*/
                            Array.isArray(condObject.get("items")) ?
                                <div>
                                    <Form.Select key={renderCondObj} aria-required={true} required defaultValue={"CHECKITEM"} onChange={e => {setRenderCondObj(e.target.value); console.log(e.target.value);}}>
                                        {condObject.get("items").map((thisOption, optionIndex) => (
                                            (optionIndex === 0 ?
                                                <>
                                                    <option value={"CHECKITEM"} disabled>select one...</option>
                                                    <option key={"items" + optionIndex} value={thisOption} >{thisOption}</option>
                                                </>
                                                : <option key={"items" + optionIndex} value={thisOption} >{thisOption}</option>)
                                        ))}
                                    </Form.Select>
                                </div>
                                : <ConditionalForms index={index} jsonObj={condObject.get("items")} />

                            : null}

                        {/*object layer has 'anyOf' object in it?*/}
                        {condObject.get("anyOf") !== undefined ?
                            /*when .get returns array, map array objects. otherwise call this component again to return the anyOf key's value*/
                            Array.isArray(condObject.get("anyOf")) ?
                                <div key={renderCondObj}>
                                    <Form.Select aria-required={true} required defaultValue={"CHECKANYOF"} onChange={e => {setRenderCondObj(e.currentTarget.value); console.log(e.currentTarget.value);}}>

                                        {condObject.get("anyOf").map((thisOption, thisIndex) => (
                                            (thisIndex === 0 ?
                                                <>
                                                    <option value={"CHECKANYOF"} disabled>select one...</option>
                                                    <option key={"anyOf" + thisIndex} value={thisIndex} >{thisOption["title"]}</option>
                                                </>
                                                : <option key={"anyOf" + thisIndex} value={thisIndex} >{thisOption["title"]}</option>)

                                        ))}
                                    </Form.Select>
                                    {/*when renderCondObj is not null, render its choices*/}
                                    {renderCondObj !== null ? <ConditionalForms index={index} key={renderCondObj} jsonObj={condObject.get("anyOf")[renderCondObj]} />
                                        : null}
                                </div>
                                : <ConditionalForms index={index} jsonObj={condObject.get("anyOf")} />

                            : null}

                        {/*object layer has 'enum' object in it?*/}
                        {condObject.get("enum") !== undefined ?
                            /*when .get returns array, map array objects. otherwise call this component again to return the enum key's value*/
                            Array.isArray(condObject.get("enum")) ?
                                <div>
                                    <Form.Group className={"col s12 d-flex flex-row"}>
                                        {condObject.get("enum").map((thisEnum) => (
                                            <div  key={thisEnum}>
                                                {/*htmlfor and name need to be unique between iterations of condforms and the same in the same iteration*/}
                                                <Form.Label htmlFor={"enum" + index} className={"ms-4 me-2"}>
                                                    {thisEnum} <Form.Check aria-required={true} required className={"ms-2"} inline name={"enum" + index}
                                                        type={"radio"} value={thisEnum} defaultChecked={null}/>
                                                </Form.Label>
                                            </div>
                                        ))}
                                    </Form.Group>
                                </div>
                                : <ConditionalForms index={index} jsonObj={condObject.get("enum")} />

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

