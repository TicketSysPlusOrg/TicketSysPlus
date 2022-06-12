import React, { useEffect, useState } from "react";
import { Form, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import ConditionalForms from "./ConditionalForms";

/*
 * ARRAYWORD: oneOf, anyOf, allOf
 * INDEX: key from the ticketForm array that called conditionalForms component. use to distinguish conditionalForms iterations/to distinguish list choices
 * JSONOBJ: the object to be sent in on conditional renders. use it to map out the 'layer' of the json file that we're at.
 * MIN: minimum items from JSON
 * MAX: maximum items from JSON
 *
* */
function ConditionalSelect({ index, jsonObj, arrayWord, min, max }) {
    /*renderCondObj is used for rendering list content as well as triggering re-renders based on select choices*/
    const [renderCondObj, setRenderCondObj] = useState(null);

    /*incoming jsonObj is already mapped out - just need to set state and use.*/
    const [condObject, setCondObject] = useState(null);

    /*on-render useEffect*/
    useEffect(() => {
        setCondObject(jsonObj);
    }, []);

    return (
        <>
            {condObject !== null ?
                <Container key={renderCondObj}>
                    <Form.Select aria-required={true} required defaultValue={renderCondObj ? renderCondObj : "selectCheck"} onChange={e => {setRenderCondObj(e.currentTarget.value); console.log(e.currentTarget.value);}}>
                        {condObject.get(arrayWord).map((thisOption, thisIndex) => (
                            (thisIndex === 0 ?
                                <>
                                    <option key={"selectCheck"} value={"selectCheck"} disabled>select one...</option>
                                    <option key={arrayWord + thisIndex} value={thisIndex} aria-valuetext={thisOption["title"]}>{thisOption["title"]}</option>
                                </>
                                : <option key={arrayWord + thisIndex} value={thisIndex} aria-valuetext={thisOption["title"]}>{thisOption["title"]}</option>)

                        ))}
                    </Form.Select>
                    {/*when renderCondObj is not null, render its choices*/}
                    {renderCondObj !== null ? <ConditionalForms index={index} key={renderCondObj} jsonObj={condObject.get(arrayWord)[renderCondObj]} min={min} max={max}  />
                        : null}
                </Container>
                : null}
        </>

    );
}

export default ConditionalSelect;
