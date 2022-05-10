import React from 'react';
import fetchData from "../APIActions/FetchData";
import TicketForms from "../StandardUser/ticketForms";


const fetchDataPromise = fetchData("ticketSchema");

function NewTicketModal() {
    //not currently using this.
    const dataDetails = fetchDataPromise.read()

    return(
        <>
            {/*<textarea>{JSON.stringify(dataDetails)}</textarea>*/}
            <TicketForms />
        </>
    )

}

export default NewTicketModal;