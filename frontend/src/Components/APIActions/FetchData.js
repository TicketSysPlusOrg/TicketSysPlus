import React from 'react';
import wrapPromise from "./WrapPromise";

function FetchData () {
    const apiDataPromise =
        fetch('http://localhost:4001/ticketInfo')
            .then((res) => res.json())

    return wrapPromise(apiDataPromise);
}

export default FetchData;