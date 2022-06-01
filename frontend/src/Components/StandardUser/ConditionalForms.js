import React, {createRef, useEffect, useState} from "react";
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {ConditionalExample} from "./DataSourceConds";
import parse from "html-react-parser";
import {forEach, map} from "react-bootstrap/ElementChildren";

function ConditionalForms(props) {
    const conJSON = ConditionalExample;
    // console.log(conJSON);

    const [showChoices, setChoices] = useState("");
    const catchItemStuff = (value) => {
        let jsonVal = JSON.parse(value);
        console.log(jsonVal);
        setChoices(jsonVal);
    };

    /*list of words to scan JSON file for. maybe this should be stored in MongoDB and be mutable by admin?*/
    const keywordList = ["type", "properties", "detail", "choices", "title", "description", "type", "items", "anyOf", "required",
        "uniqueItems", "minItems", "enum"];


    /*conditional object state. variable set to react component (html-to-react parsing)*/
    /*const [condObject, setCondObject] = useState([]);*/
    const [condObject, setCondObject] = useState(new Map());

    useEffect(() => {
        /*checkJSON(props.jsonObj, 0);*/
        checkJSON(props.jsonObj);
    }, []);


    function checkJSON(jsonData) {
        console.log(jsonData);
        setCondObject(new Map(Object.entries(jsonData)));
    }

    const [renderCondObj, setRenderCondObj] = useState(null);

    useEffect(() => {
        console.log(renderCondObj);
        /*renderReturn(renderCondObj);*/
    }, [renderCondObj]);

    /* function renderReturn(jsonData) {
        return <ConditionalForms jsonObj={jsonData} />
    }*/

    /*function findArray(jsonData) {
         null;
    }*/

    /*    /!*check items*!/
    function checkJSON(jsonData, num){
        /!*passNum is useless right now. might be needed for unique key IDs, maybe not.*!/
        let passNum = num;
        let jsonMap = new Map(Object.entries(jsonData));
        console.log(jsonMap);

        /!*checking for title and description*!/
        if(jsonMap.get("title") !== undefined) {
            setCondObject([...condObject, parse("<h5>" + jsonMap.get("title") + "</h5>")]);
        }
        if(jsonMap.get("description") !== undefined) {
            setCondObject([...condObject, parse("<h6>"+ jsonMap.get("description") + "</h6>")]);
        }

        /!*for array vals: need json obj as return val?*!/
        if(jsonMap.get("items") !== undefined && Array.isArray(jsonMap.get("items"))) {
            let itemSelections =
                "<Form.Select defaultValue={'selectOne'} onChange={(e) => catchItemStuff(e.currentTarget.value)}>\n" +
                "   <option value={'selectOne'} disabled>select one</option>\n";
            for (let thisItem in jsonMap.get("items")) {
                itemSelections += "<option value={thisItem}>{thisItem}</option>\n";
            }
            itemSelections += "</Form.Select>";

            setCondObject([...condObject, parse(itemSelections)]);
        } else if (jsonMap.get("anyOf") !== undefined && Array.isArray(jsonMap.get("anyOf"))) {
            let anyOfSelections =
                "<Form.Select defaultValue={'selectOne'} onChange={(e) => catchItemStuff(e.currentTarget.value)}>\n" +
                "   <option value={'selectOne'} disabled>select one</option>\n";
            for (let thisAnyOf in jsonMap.get("anyOf")) {
                anyOfSelections += "<option value={thisAnyOf}>{thisAnyOf}</option>\n";
            }
            anyOfSelections += "</Form.Select>";

            setCondObject([...condObject, parse(anyOfSelections)]);
        } else if (jsonMap.get("enum") !== undefined && Array.isArray(jsonMap.get("enum"))) {
            let enumSelections =
                "<Form.Select defaultValue={'selectOne'} onChange={(e) => catchItemStuff(e.currentTarget.value)}>\n" +
                "   <option value={'selectOne'} disabled>select one</option>\n";
            for (let thisEnum in jsonMap.get("enum")) {
                enumSelections += "<option value={thisEnum}>{thisEnum}</option>\n";
            }
            enumSelections += "</Form.Select>";

            setCondObject([...condObject, parse(enumSelections)]);
        }

        if (jsonMap.get("title") === undefined) {
            if(jsonMap.get("properties") !== undefined) {
                checkJSON(jsonMap.get("properties"), passNum++);
            } else if (jsonMap.get("enrollment_items") !== undefined) {
                checkJSON(jsonMap.get("enrollment_items"), passNum++);
            }
        }
        /!*else if (jsonMap['description'] === undefined) {
            }
            else if (jsonMap['title'] === undefined) {
            }*!/
        console.log(condObject);
    }*/

    /*
    * THOUGHTS/PLANNING/UNDERSTANDING
    * title? <h5> of that text
    * properties? always an object
    * detail? idk. ignore for now.
    * description? <label> of that text
    * type? object or array
    *   object, we're going deeper into json
    *   array, we're listing out a bunch of choices
    *       if listing out a bunch of choices, could be objects or just the finished items to choose from
    * items? THINGS TO PICK FROM. two things to think about:
    *   items could be object with anyOf
    *   items could be array with specific choices of items
    * anyOf? array of objects. dropdown of those object titles
    * uniqueItems? TBD
    * minItems? need to use for validation. if one not chosen, dont allow submit
    * enum?
    *
    * check if there is a 'required' section in each current object level. if yes, we need to check out that required section.
    * ^ i'm not certain if that's necessary. checking for uniqueitems/minitems/etc should be needed, though.
    *
    * how do I tell what's the end of the loops?
    *   i've found a simple array or enum that doesn't have objects that can be accessed
    *
    * */

    return (
        <>
            {/*<h5>{conJSON.properties.enrollment_items.title}</h5>

            <label>{conJSON.properties.enrollment_items.description}</label>
            <Form.Select defaultValue={"selectOne"} onChange={(e) => catchItemStuff(e.currentTarget.value)}>
                <option value={"selectOne"} disabled>Select a Customer</option>
                {conJSON.properties.enrollment_items.items.anyOf.map((thisItem, index) => (
                    <option key={index} className="mx-1" value={JSON.stringify(thisItem)}>{thisItem.title}</option>)
                )}
            </Form.Select>

            {showChoices !== "" ? <label>{showChoices.properties.choices.description}</label> : null }
            {showChoices !== "" ?
                <select>
                    {showChoices.properties.choices.items.enum.map((thisItem, index) => (
                        <option key={index} className="mx-1">{thisItem}</option>
                    ))
                    }
                </select> : null}*/}

            {/*            {condObject !== null ?
                condObject.map(thisObj => {
                    thisObj;
                })
                : <p>Nothing here yet.</p>}*/}
            {condObject !== null ?
                <div>

                    {condObject.get("title") !== undefined ?
                        <h5>{condObject.get("title")}</h5>
                        : null}

                    {condObject.get("description") !== undefined ?
                        <h6>{condObject.get("description")}</h6>
                        : null}

                    {condObject.get("properties") !== undefined ?
                        <ConditionalForms key={null} jsonObj={condObject.get("properties")} />
                        /*checkJSON(condObject.get("properties")) */
                        : null}

                    {condObject.get("enrollment_items") !== undefined ?
                        <ConditionalForms key={null} jsonObj={condObject.get("enrollment_items")} />
                        /*checkJSON(condObject.get("enrollment_items")) */
                        : null}

                    {condObject.get("items") !== undefined ?

                        Array.isArray(condObject.get("items")) ?
                            <Form.Select defaultValue={"selectOneItem"} onChange={e => setRenderCondObj(e.currentTarget.value)}>
                                <option value={"selectOneItem"} disabled>Select a Customer</option>

                                {condObject.get("items").map((thisOption, index) => (
                                    <option key={"items" + index} value={thisOption} onSelect={() => <ConditionalForms key={index} jsonObj={thisOption} />}>{thisOption}</option>
                                ))}

                            </Form.Select>
                            : <ConditionalForms jsonObj={condObject.get("items")} />

                        : null}

                    {condObject.get("anyOf") !== undefined ?

                        Array.isArray(condObject.get("anyOf")) ?
                            <Form.Select defaultValue={"selectOneAnyOf"} onChange={(e) => <ConditionalForms jsonObj={e.target.value} />}>
                                <option value={"selectOneAnyOf"} disabled>Select a Customer</option>

                                {condObject.get("anyOf").map((thisOption, index) => (
                                    <option key={"anyOf" + thisOption["title"] +"anyOf"} value={thisOption} onSelect={() => setRenderCondObj(thisOption)}>{thisOption["title"]}</option>
                                ))}

                            </Form.Select>
                            : <ConditionalForms jsonObj={condObject.get("anyOf")} />

                        : null}


                </div>
                : null }

        </>
    );
}

export default ConditionalForms;
