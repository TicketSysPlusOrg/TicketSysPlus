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

    const [condObject, setCondObject] = useState(null);

    useEffect(() => {
        console.log("min: " + min);
        console.log("max: " + max);
        setCondObject(jsonObj);
    }, []);

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
                                    <Form.Check aria-required={true} required className={"ms-2 optionSelects"} inline name={ max === 1 ? index+"enum" : index+"enum"+thisIndex}
                                        type={max === 1 ? "radio" : "checkbox"} aria-valuetext={thisEnum} value={thisEnum} />
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
