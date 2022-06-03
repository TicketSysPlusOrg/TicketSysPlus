import React from "react";
import JsonForm from "../AdminUser/jsonForms";

function NewJsonModal({jsonFetch}) {

    return (
        <>
            <JsonForm jsonModal={jsonFetch}/>
        </>
    );

}

export default NewJsonModal;
