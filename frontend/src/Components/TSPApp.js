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
        < >
            <div className="">
                <h1 className="text-center">Order Form</h1>
                <p className="text-center text-dark">JSON Data generated: {apiData.properties.grocery_info.title}</p>
            </div>
            <div className="container mt-5">
                <div className="row align-items-center justify-content-center">
                    <div className="col-6 text-center">
                        <input className="form-check-input " type="checkbox" value="" id="flexCheckChecked" />
                        <label className="form-check-label ms-2" htmlFor="flexCheckChecked">
                            Do some shopping?
                        </label>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TSPApp;