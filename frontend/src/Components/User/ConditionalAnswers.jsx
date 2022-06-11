import React, { useEffect, useState } from "react";
import { Form, Container } from "react-bootstrap";
import PropTypes from "prop-types";
import ConditionalForms from "./ConditionalForms";


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
                        {condObject.get("enum").map((thisEnum) => (
                            <div  key={thisEnum}>
                                {/*htmlfor and name need to be unique between iterations of condforms and the same in the same iteration*/}
                                <Form.Label htmlFor={"enum" + index} className={"ms-4 me-2"} aria-valuetext={thisEnum}>
                                    {thisEnum} <Form.Check aria-required={true} required className={"ms-2"} inline name={"enum" + index}
                                        type={"radio"} value={thisEnum} defaultChecked={null}/>
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
