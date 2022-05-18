import React from "react";
import fetchData from "../APIActions/FetchData";
import JsonForm from "../AdminUser/jsonForms";


const fetchDataPromise = fetchData("jsonSchema");

function NewJsonModal() {

    return (
        <>
            <JsonForm />
        </>
    );

}

export default NewJsonModal;
