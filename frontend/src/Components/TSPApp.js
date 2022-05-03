import React, { useState, useEffect } from 'react';
// import TSPApp from './TSPApp.css';

function TSPApp(props) {
    const [apiData, setAPIres] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!props.login) return;

        fetch('http://localhost:4001/ticketInfo', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then((res) => res.json())
            .then(setAPIres)
            .catch(setError);
    }, [props.login, setAPIres]);

    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
    if (!apiData) return null;

    return(
        <div>
            <h1 className="text-center">Make a Ticket</h1>
            <p className="text-center">Some stuff: {apiData.properties.grocery_info.title}</p>
        </div>

    );
}


export default TSPApp;