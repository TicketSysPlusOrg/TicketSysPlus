import React, { useState, useEffect } from 'react';

function TSPApp(props) {
    const [apiData, setAPIres] = useState(null);
    const [error, setError] = useState(null);

    //onclick event to show or hide shopping choices
    const [showDiv, setShowDiv] = useState(false);
    let onClickCheck = () => showDiv ? setShowDiv(false) : setShowDiv(true);

    //onselect event to show/hide related lists
    const [showVeg, setShowVeg] = useState(false);
    let onSelectVeg = () => !showVeg ? setShowVeg(true) : setShowVeg(false);
    const [showFruit, setShowFruit] = useState(false);
    let onSelectFruit = () => !showFruit ? setShowFruit(true) : setShowFruit(false);

    let onSelectList = () =>
    {
        setShowVeg(false);
        setShowFruit(false);
        // console.log(val);

        if(1) {
            setShowVeg(true);
        }
        else if (2) {
            setShowFruit(true);
        }
    }

    useEffect(() => {
        if (!props.login) return;

        fetch('http://localhost:4001/ticketInfo')
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
                <p className="text-center text-dark"><i>JSON Data generated:</i> {apiData.properties.grocery_info.title}</p>
            </div>
            <div className="container mt-5">
                <div className="row align-items-center justify-content-center">
                    <div className="col-6 text-center">
                        <input className="form-check-input mt-3" type="checkbox" value="" id="flexCheckChecked" onClick={onClickCheck}/>
                        <label className="form-check-label ms-2 fs-3" htmlFor="flexCheckChecked">
                            Do some shopping!
                        </label>
                    </div>
                    {showDiv ?
                    <div className="text-center mt-4">
                        <label className="px-2 d-block mb-2">{apiData.properties.grocery_info.properties.items.description}</label>
                        <select className="px-2 py-1" onChange={onSelectList}>

                            <option className="text-secondary" value={0}> Select a List </option>

                            <option value={1} >
                                {apiData.properties.grocery_info.properties.items.items.anyOf[0].title}
                            </option>

                            <option  value={2}>
                                {apiData.properties.grocery_info.properties.items.items.anyOf[1].title}
                            </option>

                        </select>

                        {showVeg ?
                            <ul className="list-unstyled">
                                {apiData.properties.grocery_info.properties.items.items.anyOf[0].veggies.map((thisVeggie) => (
                                    <li key={thisVeggie}>{thisVeggie}</li>
                                ))}
                            </ul>
                            : null}
                        {showFruit ?
                            <ul className="list-unstyled">
                                {apiData.properties.grocery_info.properties.items.items.anyOf[1].fruits.map((thisFruit) => (
                                    <li key={thisFruit}>{thisFruit}</li>
                                ))}
                            </ul>
                            : null}

                    </div>
                    : null}
                </div>
            </div>
        </>
    );
};


export default TSPApp;