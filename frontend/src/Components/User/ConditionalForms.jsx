import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { ConditionalExample } from "./DataSourceConds";
import ConditionalSelect from "./ConditionalSelect";
import ConditionalAnswers from "./ConditionalAnswers";

/**
 * Adam Percival, Nathan Arrowsmith, Pavel Krokhalev, Conor O'Brien
 * 6/16/2022
 *
 * This component handles initial JSON pull from database and renders titles/descriptions or makes further component call
 * as needed. It is used to iterate through a JSON file for dynamic rendering of a questionnaire.
 * @param {props} index key from the ticketForm array that called conditionalForms component.
 *          use to distinguish conditionalForms iterations/to distinguish list choices
 * @param {props} jsonObj the object to be sent in on conditional renders. use it to map out the 'layer' of the json file that we're at.
 * @param {props} min minimum amount of choices required
 * @param {props} max maximum amount of choices required
 * @returns {JSX.Element} ConditionalForms component.
 */
function ConditionalForms({ index, jsonObj, min, max }) {
    /* this is the current dummy json file. leaving for testing purposes.*/
    //const conJSON = ConditionalExample;

    /*
    * each time ConditionalForms is rendered, map the new layer of key/val pairs
    * */
    const [condObject, setCondObject] = useState(new Map());

    /*on-render useEffect*/
    useEffect(() => {
        checkJSON();
    }, []);

    /*if jsonObj is undefined, use json import to kick off conditionals.
        otherwise using props sent by component self calls/conditional select calls.*/
    function checkJSON() {
        if(jsonObj !== undefined) {
            setCondObject(new Map(Object.entries(jsonObj)));
        } else {
            console.log("There's a database JSON error!");
        }
    }

    /* console log to see whenever renderCondObj is changed. helpful for troubleshooting. */
    // useEffect(() => {
    //     console.log(condObject);
    // }, [condObject]);

    {/*
    *
    * CHECK TITLE AND DESCRIPTION FIRST. IF NOT RETURNING UNDEFINED, RENDER EACH/EITHER BASED ON THAT.
    * NEXT CHECK PROPERTIES. IF 'PROPERTIES' NOT RETURNING UNDEFINED, LOOK AT TWO FOLLOWS OPTIONS:
    *   IF 'REQUIRED' NOT RETURNING UNDEFINED, RENDER NEW COMPONENT WITH JSONOBJ={(CONDOBJECT.GET("PROPERTIES")[CONDOBJECT.GET("REQUIRED)]}
    *   IF 'REQUIRED' RETURNING UNDEFINED, RENDER NEW COMPONENT WITH JSONOBJ={CONDOBJ.GET("PROPERTIES")}
    * NEXT CHECK .GET ITEMS, CHOICES, ANYOF, AND ENUM (NOT NECESSARILY IN THAT ORDER).
    *   IF ANY OF THOSE ARE CONTAINED (I.E. NOT RETURNING UNDEFINED), SEE IF WHAT THEY RETURN IS AN ARRAY OR NOT.
    *       IF IT'S AN ARRAY, IS IT AN ARRAY OF OBJECTS OR ARRAY OF STRINGS/ENUMS/NUMBERS/BOOLEANS?
    *           IF ARRAY OF OBJECTS (KEY-VAL PAIRS), SELECT LIST GENERATION.
    *           IF ARRAY OF ENUM, WE'VE REACHED AN END POINT. REQUIRE A SELECTION (OR MULTI) AND RETURN ALL INFO ON SUBMIT.
    */}

    return (
        <>
            <div key={index}>
                {condObject !== null ?
                    <div>

                        {/* object layer has 'title' in it? h5 */}
                        {condObject.has("title") ?
                            <h5 aria-valuetext={condObject.get("title")}>{condObject.get("title")}</h5>
                            : null}

                        {/* object layer has 'description' in it? h6 */}
                        {condObject.has("description") ?
                            <h6 aria-valuetext={condObject.get("description")}>{condObject.get("description")}</h6>
                            : null}

                        {/* object layer has 'properties' key in it? */}
                        {condObject.has("properties") ?
                            condObject.get("required") !== undefined ?
                                <ConditionalForms index={index} jsonObj={condObject.get("properties")[condObject.get("required")]} min={0} max={0} />
                                : <ConditionalForms index={index} jsonObj={condObject.get("properties")} min={0} max={0} />
                            : null}

                        {/*CHOICES IS PROBABLY USELESS. I FOUND IN JSON ONLINE BUT IT'S NOT STANDARD JSON VERBIAGE*/}
                        {/*object layer has 'choices' key in it?*/}
                        {condObject.has("choices") ?
                            Array.isArray(condObject.get("choices")) ?
                                <ConditionalSelect index={index} jsonObj={condObject} arrayWord={"choices"} min={0} max={0} />
                                : <ConditionalForms index={index} jsonObj={condObject.get("choices")} min={0} max={0} />
                            : null}

                        {/*<ConditionalSelect index={index} jsonObj={condObject} arrayWord={"items"} min={condObj.get("minItems")} max={condObj.get("maxItems")}/>*/}
                        {/*object layer has 'items' key in it?*/}
                        {condObject.has("items") ?
                            /*when .get returns array, map array object. otherwise call this component again to return the items key's values*/
                            Array.isArray(condObject.get("items")) ?
                                <ConditionalSelect index={index} jsonObj={condObject} arrayWord={"items"}
                                    min={condObject.has("minItems") ? condObject.get("minItems") : min}
                                    max={condObject.has("maxItems") ? condObject.get("maxItems") : max}/>
                                : <ConditionalForms index={index} jsonObj={condObject.get("items")}
                                    min={condObject.has("minItems") ? condObject.get("minItems") : min}
                                    max={condObject.has("maxItems") ? condObject.get("maxItems") : max}/>
                            : null}

                        {/*object layer has 'anyOf', 'allOf', or 'oneOf' object in it?*/}
                        {/*NOTE: oneOf, anyOf, allOf have to be arrays by JSON standard*/}
                        {condObject.has("anyOf") ?
                            <ConditionalSelect index={index} jsonObj={condObject} arrayWord={"anyOf"} min={0} max={0} />
                            : null}

                        {condObject.has("oneOf") ?
                            <ConditionalSelect index={index} jsonObj={condObject} arrayWord={"oneOf"} min={0} max={0} />
                            : null}

                        {condObject.has("allOf") ?
                            <ConditionalSelect index={index} jsonObj={condObject} arrayWord={"allOf"} min={0} max={0} />
                            : null}


                        {/*FINAL DATA SELECTION*/}

                        {/* object layer has 'enum' object in it? */}
                        {/* enum will always be array by JSON standards */}
                        {condObject.has("enum") ?
                            /*when .get returns array, map array objects. otherwise call this component again to return the enum key's value*/
                            Array.isArray(condObject.get("enum")) ?
                                <ConditionalAnswers index={index} jsonObj={condObject} min={min} max={max} />
                                : <ConditionalForms index={index} jsonObj={condObject.get("enum")} min={0} max={0} />

                            : null}

                        {/*if the code has gotten this far, we are looking to see if a 'required' was missed in JSON layer with properties*/}
                        {!condObject.has("required") && condObject.size === 1 ?
                            condObject.get(condObject.keys().next().value) !== undefined ?
                                <ConditionalForms index={index} jsonObj={condObject.get(condObject.keys().next().value)} min={0} max={0} />
                                : null
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
