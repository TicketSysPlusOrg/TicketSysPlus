import React, { useEffect, useState } from "react";
import { Form, Container } from "react-bootstrap";
import PropTypes from "prop-types";


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

    /*the className + index should allow specificity for changing 'required' in inputValChange*/
    /*this does create a condition where we have to worry about when adding additional sources, though.
        thus, for now, the className will be shared across all conditionalForms instances*/
    useEffect(() => {
        setInputVals(document.getElementsByClassName("optionSelects"));
        setCondObject(jsonObj);
    }, []);

    useEffect(() => {
        inputVals !== null ? inputValChange() : null;
    }, [inputVals]);

    /*use to give a text flag in inputs for reading data from the conditional forms on submission of ticket*/
    /*also use to remove required from all of these checkBoxes when we find at least one checked */
    function inputValChange() {
        console.log(inputVals);

        /*swap this to false if any checks found*/
        let startBool = false;
        for (let i = 0; i < inputVals.length; i++) {
            if(inputVals[i].children[0].checked) {
                inputVals[i].children[0].value = "checked";
                startBool = true;
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

    return (
        <>
            {condObject  && inputVals ?
                <div>
                    <Form.Group className={"col s12 d-flex flex-row"}>
                        {condObject.get("enum").map((thisEnum, thisIndex) => (

                            <Form.Label key={thisEnum} htmlFor={max === 1 ? index+"enum" : index+"enum"+thisIndex} className={"ms-4 me-2"} aria-valuetext={thisEnum}>
                                {thisEnum}
                                <Form.Check required={true} className={"ms-2 optionSelects"} inline name={ max === 1 ? index+"enum" : index+"enum"+thisIndex}
                                    type={max === 1 ? "radio" : "checkbox"} aria-valuetext={thisEnum} onLoad={inputValChange} onChange={inputValChange} value={" "} />
                            </Form.Label>
                        ))}
                    </Form.Group>
                </div>
                : null}
        </>
    );
}

export default ConditionalAnswers;
