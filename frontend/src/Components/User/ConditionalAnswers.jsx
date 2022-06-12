import React, { useEffect, useState } from "react";
import { Form, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import ConditionalForms from "./ConditionalForms";

/*NOTE: this can be improved with more time and thought. currently, only providing possible selection between pick one or pick as many as you want*/

/*
 * INDEX: key from the ticketForm array that called conditionalForms component. use to distinguish conditionalForms iterations/to distinguish list choices
 * JSONOBJ: the object to be sent in on conditional renders. use it to map out the 'layer' of the json file that we're at.
 * MIN: minimum items from JSON
 * MAX: maximum items from JSON
 * (min and max are checked to see if select on or multi select)
* */
function ConditionalAnswers({ index, jsonObj, min, max }) {

    /*conditional object  updated on render*/
    const [condObject, setCondObject] = useState(null);
    /*input values with className of optionsSelects for value changes and return info*/
    const [inputVals, setInputVals] = useState(null);

    /*the className + index should allow specificity for changing required in inputValChange*/
    useEffect(() => {
        setInputVals(document.getElementsByClassName("optionSelects"+ index));
        setCondObject(jsonObj);
    }, []);

    /*used to give a text flag in inputs for reading data from the conditional forms on submission of ticket*/
    /*also used to remove required from all of these checkBoxes when we find at least one checked */
    function inputValChange() {
        /*swap this to false if any checks found*/
        console.log(inputVals);
        let startBool = false;
        for (let i = 0; i < inputVals.length; i++) {
            if(inputVals[i].children[0].checked) {
                startBool = true;
                inputVals[i].children[0].value = "checked";
            } else {
                inputVals[i].children[0].value = " ";
            }
        }
        if(startBool) {
            for (let j = 0; j < inputVals.length; j++) {
                inputVals[j].children[0].required = false;
            }
        }
    }

    /*dynamically putting required on all checkboxes for html validation on submit*/
    /*this runs on change event and verifies that at least one choice is checked. if it's not, leave required=true, else if one found, uncheck all*/
    function requiredOrNot() {
        /*swap this to false if any checks found*/
        const startBool = true;
    }

    /*TODO: make this page generate check boxes or radio based on single or multi choice, utilizing min and max to find a number*/
    return (
        <>
            {condObject ?
                <div>
                    <Form.Group className={"col s12 d-flex flex-row"}>
                        {condObject.get("enum").map((thisEnum, thisIndex) => (
                            <div  key={thisEnum}>
                                {/*htmlfor and name need to be unique between iterations of condforms and the same in the same iteration*/}
                                <Form.Label htmlFor={max === 1 ? index+"enum" : index+"enum"+thisIndex} className={"ms-4 me-2"} aria-valuetext={thisEnum}>
                                    {thisEnum}
                                    <Form.Check required={true} className={"ms-2 optionSelects"+ index} inline name={ max === 1 ? index+"enum" : index+"enum"+thisIndex}
                                        type={max === 1 ? "radio" : "checkbox"} aria-valuetext={thisEnum} onChange={inputValChange} value={" "} />
                                </Form.Label>
                            </div>
                        ))}
                    </Form.Group>
                </div>
                : null}
        </>
    );
}

export default ConditionalAnswers;
