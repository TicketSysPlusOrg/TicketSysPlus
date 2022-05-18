import React, {createRef, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import {ConditionalExample} from "./DataSourceConds";

function ConditionalForms() {
    const conJSON = ConditionalExample;
    // console.log(conJSON);

    const [showChoices, setChoices] = useState("");

    const catchItemStuff = (value) => {
        let jsonVal = JSON.parse(value);
        console.log(jsonVal);
        setChoices(jsonVal);
    };

    return (
        <>
            <h5>{conJSON.properties.enrollment_items.title}</h5>

            <label>{conJSON.properties.enrollment_items.description}</label>
            <select onChange={(e) => catchItemStuff(e.currentTarget.value)}>
                <option selected disabled>Select a Customer</option>
                {conJSON.properties.enrollment_items.items.anyOf.map((thisItem, index) => (
                    <option key={index} className="mx-1" value={JSON.stringify(thisItem)}>{thisItem.title}</option>
                )
                )}
            </select>

            {showChoices !== "" ? <label>{showChoices.properties.choices.description}</label> : null }
            {showChoices !== "" ?
                <select>
                    {showChoices.properties.choices.items.enum.map((thisItem, index) => (
                        <option key={index} className="mx-1">{thisItem}</option>
                    ))
                    }
                </select> : null}

        </>
    );
}

export default ConditionalForms;
