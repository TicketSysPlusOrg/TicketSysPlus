import React from "react";
import fetchData from "../APIActions/FetchData";
import JsonForm from "../AdminUser/jsonForms";


const fetchDataPromise = fetchData("jsonSchema");

function NewJsonModal({jsonFetch}) {

    return (
        <>
            <JsonForm jsonModal={jsonFetch}/>
        </>
    );

}

export default NewJsonModal;
